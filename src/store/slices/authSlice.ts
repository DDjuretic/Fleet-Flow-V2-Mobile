import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { roleService } from '../../services/roleService';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

interface UserPermissions {
  roles: string[];
  permissions: string[];
  department?: string;
  position?: string;
  canApproveReservations: boolean;
  canAccessFleetManager: boolean;
  canManageVehicles: boolean;
  canManageUsers: boolean;
}

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  permissions: UserPermissions | null;
  permissionsLoading: boolean;
  lastPermissionCheck: number | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  permissions: null,
  permissionsLoading: false,
  lastPermissionCheck: null,
};

// Async thunk for loading user permissions
export const loadUserPermissions = createAsyncThunk(
  'auth/loadUserPermissions',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Loading permissions for user:', userId);
      
      // Get user roles and permissions
      const userWithRoles = await roleService.getUserRolesAndPermissions(userId);
      
      if (!userWithRoles) {
        throw new Error('Failed to load user permissions');
      }

      // Check specific permissions
      const [canApprove, canAccessFM, canManageVehicles, canManageUsers] = await Promise.all([
        roleService.canApproveReservations(userId),
        roleService.canAccessFleetManager(userId),
        roleService.canManageVehicles(userId),
        roleService.hasPermission(userId, 'users:manage')
      ]);

      // Get user profile for department/position
      const { data: profile } = await supabase
        .from('users')
        .select('department, position')
        .eq('user_id', userId)
        .single();

      const permissions: UserPermissions = {
        roles: userWithRoles.roles.map(r => r.role_name),
        permissions: userWithRoles.permissions.map(p => p.permission_name),
        department: profile?.department,
        position: profile?.position,
        canApproveReservations: canApprove,
        canAccessFleetManager: canAccessFM,
        canManageVehicles: canManageVehicles,
        canManageUsers: canManageUsers,
      };

      console.log('✅ Permissions loaded:', permissions);
      return permissions;
    } catch (error) {
      console.error('❌ Error loading permissions:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for auto-assigning permissions
export const autoAssignUserPermissions = createAsyncThunk(
  'auth/autoAssignPermissions',
  async ({ userId, userData }: { 
    userId: string; 
    userData: { department?: string; position?: string; company_tier?: string; }
  }, { dispatch, rejectWithValue }) => {
    try {
      console.log('🤖 Auto-assigning permissions for user:', userId);
      
      await roleService.autoAssignPermissions(userId, userData);
      
      // Reload permissions after assignment
      await dispatch(loadUserPermissions(userId));
      
      return true;
    } catch (error) {
      console.error('❌ Error auto-assigning permissions:', error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.permissions = null;
      state.lastPermissionCheck = null;
    },
    // Permission helpers
    updatePermissionCache: (state, action: PayloadAction<Partial<UserPermissions>>) => {
      if (state.permissions) {
        state.permissions = { ...state.permissions, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load permissions
      .addCase(loadUserPermissions.pending, (state) => {
        state.permissionsLoading = true;
      })
      .addCase(loadUserPermissions.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        state.permissions = action.payload;
        state.lastPermissionCheck = Date.now();
      })
      .addCase(loadUserPermissions.rejected, (state) => {
        state.permissionsLoading = false;
        state.permissions = null;
      })
      // Auto-assign permissions
      .addCase(autoAssignUserPermissions.pending, (state) => {
        state.permissionsLoading = true;
      })
      .addCase(autoAssignUserPermissions.fulfilled, (state) => {
        state.permissionsLoading = false;
      })
      .addCase(autoAssignUserPermissions.rejected, (state) => {
        state.permissionsLoading = false;
      });
  },
});

export const { 
  setUser, 
  setSession, 
  setLoading, 
  clearAuth, 
  updatePermissionCache 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectSession = (state: { auth: AuthState }) => state.auth.session;
export const selectPermissions = (state: { auth: AuthState }) => state.auth.permissions;
export const selectCanApproveReservations = (state: { auth: AuthState }) => 
  state.auth.permissions?.canApproveReservations || false;
export const selectCanAccessFleetManager = (state: { auth: AuthState }) => 
  state.auth.permissions?.canAccessFleetManager || false;
export const selectCanManageVehicles = (state: { auth: AuthState }) => 
  state.auth.permissions?.canManageVehicles || false;
export const selectCanManageUsers = (state: { auth: AuthState }) => 
  state.auth.permissions?.canManageUsers || false; 