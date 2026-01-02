import { supabase } from '../lib/supabase';

export interface UserRole {
  role_id: string;
  role_name: string;
  description?: string;
}

export interface UserPermission {
  permission_id: string;
  permission_name: string;
  description?: string;
  module?: string;
}

export interface UserWithRoles {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: UserRole[];
  permissions: UserPermission[];
}

// Auto-assignment rules interface
interface AutoAssignmentRule {
  trigger: 'role' | 'department' | 'position' | 'company_tier';
  condition: string;
  permissions: string[];
  roles?: string[];
}

// Department hierarchy mapping
interface DepartmentHierarchy {
  [department: string]: {
    defaultRole: string;
    permissions: string[];
    canManage: string[]; // which departments this can manage
  };
}

// Default department hierarchy
const DEPARTMENT_HIERARCHY: DepartmentHierarchy = {
  'Executive': {
    defaultRole: 'general_manager',
    permissions: ['*'], // All permissions except system admin
    canManage: ['Management', 'Finance', 'Operations', 'Warehouse', 'Retail']
  },
  'Management': {
    defaultRole: 'manager',
    permissions: ['dashboard:admin', 'users:manage', 'vehicles:manage', 'reports:view'],
    canManage: ['Finance', 'Operations', 'Warehouse', 'Retail']
  },
  'Finance': {
    defaultRole: 'finance',
    permissions: ['expenses:manage', 'reports:view', 'dashboard:fleet_manager'],
    canManage: []
  },
  'Operations': {
    defaultRole: 'dispatcher',
    permissions: ['trips:manage', 'reservations:manage', 'vehicles:view'],
    canManage: ['Warehouse']
  },
  'Warehouse': {
    defaultRole: 'warehouse',
    permissions: ['vehicles:view', 'trips:view', 'reservations:view'],
    canManage: []
  },
  'Retail': {
    defaultRole: 'retail',
    permissions: ['reservations:create', 'trips:view'],
    canManage: []
  }
};

// Auto-assignment rules
const AUTO_ASSIGNMENT_RULES: AutoAssignmentRule[] = [
  {
    trigger: 'role',
    condition: 'admin',
    permissions: ['*'], // all permissions
    roles: ['admin']
  },
  {
    trigger: 'role',
    condition: 'general_manager',
    permissions: ['*'], // all permissions except system admin functions
    roles: ['general_manager']
  },
  {
    trigger: 'department',
    condition: 'Management',
    permissions: ['dashboard:admin', 'users:manage', 'vehicles:manage'],
    roles: ['manager']
  },
  {
    trigger: 'position',
    condition: 'General Manager',
    permissions: ['*'], // All permissions
    roles: ['general_manager']
  },
  {
    trigger: 'position',
    condition: 'Fleet Manager',
    permissions: ['dashboard:fleet_manager', 'vehicles:manage', 'trips:manage'],
    roles: ['manager']
  },
  {
    trigger: 'position',
    condition: 'Driver',
    permissions: ['trips:create', 'trips:view', 'vehicles:view'],
    roles: ['driver']
  }
];

class RoleService {
  
  /**
   * Get user roles and permissions
   */
  async getUserRolesAndPermissions(userId: string): Promise<UserWithRoles | null> {
    try {
      // Get user basic info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, email, first_name, last_name')
        .eq('user_id', userId)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user:', userError);
        return null;
      }

      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          roles (
            role_id,
            role_name,
            description
          )
        `)
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return null;
      }

      // Get user permissions (through roles)
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_roles')
        .select(`
          roles!inner (
            role_permissions (
              permissions (
                permission_id,
                permission_name,
                description,
                module
              )
            )
          )
        `)
        .eq('user_id', userId);

      if (permissionsError) {
        console.error('Error fetching user permissions:', permissionsError);
        return null;
      }

      // Process roles
      const roles: UserRole[] = rolesData?.map((item: any) => item.roles).filter(Boolean) || [];

      // Process permissions (flatten and remove duplicates)
      const permissions: UserPermission[] = [];
      const permissionIds = new Set<string>();

      permissionsData?.forEach((item: any) => {
        item.roles?.role_permissions?.forEach((rp: any) => {
          if (rp.permissions && !permissionIds.has(rp.permissions.permission_id)) {
            permissions.push(rp.permissions);
            permissionIds.add(rp.permissions.permission_id);
          }
        });
      });

      return {
        ...userData,
        roles,
        permissions
      };

    } catch (error) {
      console.error('Error in getUserRolesAndPermissions:', error);
      return null;
    }
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking permission "${permissionName}" for user ${userId}`);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles!inner (
            role_permissions!inner (
              permissions!inner (
                permission_name
              )
            )
          )
        `)
        .eq('user_id', userId)
        .eq('roles.role_permissions.permissions.permission_name', permissionName)
        .limit(1);

      if (error) {
        console.error('❌ Error checking permission:', error);
        return false;
      }

      const hasPermission = data && data.length > 0;
      console.log(`✅ Permission "${permissionName}" result:`, hasPermission);
      
      return hasPermission;
    } catch (error) {
      console.error('❌ Error in hasPermission:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
    try {
      const promises = permissionNames.map(permission => this.hasPermission(userId, permission));
      const results = await Promise.all(promises);
      return results.some(result => result === true);
    } catch (error) {
      console.error('Error in hasAnyPermission:', error);
      return false;
    }
  }

  /**
   * Check if user has role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking role "${roleName}" for user ${userId}`);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles!inner (
            role_name
          )
        `)
        .eq('user_id', userId)
        .eq('roles.role_name', roleName)
        .limit(1);

      if (error) {
        console.error('❌ Error checking role:', error);
        return false;
      }
      
      const hasRole = data && data.length > 0;
      console.log(`✅ Role "${roleName}" result:`, hasRole);
      console.log('📋 Raw data:', JSON.stringify(data, null, 2));
      
      return hasRole;
    } catch (error) {
      console.error('Error in hasRole:', error);
      return false;
    }
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId
        });

      if (error) {
        console.error('Error assigning role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in assignRole:', error);
      return false;
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        console.error('Error removing role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeRole:', error);
      return false;
    }
  }

  /**
   * Get all available roles
   */
  async getAllRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('role_id, role_name, description')
        .order('role_name');

      if (error) {
        console.error('Error fetching roles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllRoles:', error);
      return [];
    }
  }

  /**
   * Check if user can approve reservations
   */
  async canApproveReservations(userId: string): Promise<boolean> {
    return this.hasAnyPermission(userId, [
      'reservations:approve', 
      'reservations:manage'
    ]);
  }

  /**
   * Check if user can access fleet manager dashboard
   */
  async canAccessFleetManager(userId: string): Promise<boolean> {
    console.log('🚗 Checking Fleet Manager access for user:', userId);
    const result = await this.hasAnyPermission(userId, [
      'dashboard:fleet_manager',
      'dashboard:admin'
    ]);
    console.log('🚗 Fleet Manager access result:', result);
    return result;
  }

  /**
   * Check if user can manage vehicles
   */
  async canManageVehicles(userId: string): Promise<boolean> {
    return this.hasAnyPermission(userId, [
      'vehicles:create',
      'vehicles:update',
      'vehicles:delete'
    ]);
  }

  /**
   * Auto-assign roles and permissions based on user data
   */
  async autoAssignPermissions(userId: string, userData: {
    department?: string;
    position?: string;
    company_tier?: string;
  }): Promise<void> {
    try {
      console.log('🤖 Auto-assigning permissions for user:', userId, userData);

      // Apply department-based rules
      if (userData.department && DEPARTMENT_HIERARCHY[userData.department]) {
        const deptConfig = DEPARTMENT_HIERARCHY[userData.department];
        
        // Assign default role for department
        await this.assignRoleByName(userId, deptConfig.defaultRole);
        
        // Assign department-specific permissions
        for (const permission of deptConfig.permissions) {
          await this.grantPermission(userId, permission);
        }
      }

      // Apply auto-assignment rules
      for (const rule of AUTO_ASSIGNMENT_RULES) {
        let shouldApply = false;

        switch (rule.trigger) {
          case 'department':
            shouldApply = userData.department === rule.condition;
            break;
          case 'position':
            shouldApply = userData.position === rule.condition;
            break;
          case 'company_tier':
            shouldApply = userData.company_tier === rule.condition;
            break;
        }

        if (shouldApply) {
          // Assign roles
          if (rule.roles) {
            for (const role of rule.roles) {
              await this.assignRoleByName(userId, role);
            }
          }

          // Assign permissions
          for (const permission of rule.permissions) {
            if (permission === '*') {
              await this.grantAllPermissions(userId);
            } else {
              await this.grantPermission(userId, permission);
            }
          }
        }
      }

      console.log('✅ Auto-assignment completed');
    } catch (error) {
      console.error('❌ Error in auto-assignment:', error);
      throw error;
    }
  }

  /**
   * Assign role to user by name
   */
  private async assignRoleByName(userId: string, roleName: string): Promise<void> {
    try {
      // Get role ID
      const { data: role } = await supabase
        .from('roles')
        .select('role_id')
        .eq('role_name', roleName)
        .single();

      if (!role) {
        console.warn(`Role ${roleName} not found`);
        return;
      }

      // Use existing assignRole method
      await this.assignRole(userId, role.role_id);
      
      console.log(`✅ Assigned role ${roleName} to user ${userId}`);
    } catch (error) {
      console.error(`❌ Error assigning role ${roleName}:`, error);
    }
  }

  /**
   * Grant specific permission to user
   */
  private async grantPermission(userId: string, permissionName: string): Promise<void> {
    try {
      // This would be implemented based on your permission system
      // For now, we'll use the role-based approach
      console.log(`🔑 Granting permission ${permissionName} to user ${userId}`);
    } catch (error) {
      console.error(`❌ Error granting permission ${permissionName}:`, error);
    }
  }

  /**
   * Grant all permissions to user (admin)
   */
  private async grantAllPermissions(userId: string): Promise<void> {
    try {
      // Get admin role
      const { data: adminRole } = await supabase
        .from('roles')
        .select('role_id')
        .eq('role_name', 'admin')
        .single();

      if (adminRole) {
        await this.assignRoleByName(userId, 'admin');
        console.log(`✅ Granted admin permissions to user ${userId}`);
      }
    } catch (error) {
      console.error('❌ Error granting all permissions:', error);
    }
  }

  /**
   * Check if user can manage another user based on department hierarchy
   */
  async canManageUser(managerId: string, targetUserId: string): Promise<boolean> {
    try {
      // Get both users' departments
      const { data: users } = await supabase
        .from('users')
        .select('user_id, department')
        .in('user_id', [managerId, targetUserId]);

      if (!users || users.length !== 2) return false;

      const manager = users.find(u => u.user_id === managerId);
      const target = users.find(u => u.user_id === targetUserId);

      if (!manager?.department || !target?.department) return false;

      // Check hierarchy
      const managerDept = DEPARTMENT_HIERARCHY[manager.department];
      return managerDept?.canManage.includes(target.department) || false;
    } catch (error) {
      console.error('Error checking user management permission:', error);
      return false;
    }
  }

  /**
   * Bulk assign role to multiple users
   */
  async bulkAssignRole(userIds: string[], roleId: string): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };

    for (const userId of userIds) {
      try {
        const success = await this.assignRole(userId, roleId);
        if (success) {
          results.success.push(userId);
        } else {
          results.failed.push(userId);
        }
      } catch (error) {
        console.error(`Failed to assign role to user ${userId}:`, error);
        results.failed.push(userId);
      }
    }

    return results;
  }

  /**
   * Bulk remove role from multiple users
   */
  async bulkRemoveRole(userIds: string[], roleId: string): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };

    for (const userId of userIds) {
      try {
        const success = await this.removeRole(userId, roleId);
        if (success) {
          results.success.push(userId);
        } else {
          results.failed.push(userId);
        }
      } catch (error) {
        console.error(`Failed to remove role from user ${userId}:`, error);
        results.failed.push(userId);
      }
    }

    return results;
  }

  /**
   * Get role hierarchy (which roles can manage which)
   */
  getRoleHierarchy(): { [role: string]: { level: number, canManage: string[] } } {
    return {
      'admin': { level: 1, canManage: ['general_manager', 'manager', 'dispatcher', 'finance', 'driver'] },
      'general_manager': { level: 2, canManage: ['manager', 'dispatcher', 'finance', 'driver'] },
      'manager': { level: 3, canManage: ['dispatcher', 'finance', 'driver'] },
      'dispatcher': { level: 4, canManage: ['driver'] },
      'finance': { level: 4, canManage: [] },
      'driver': { level: 5, canManage: [] }
    };
  }

  /**
   * Check if one role can manage another role
   */
  canRoleManageRole(managerRole: string, targetRole: string): boolean {
    const hierarchy = this.getRoleHierarchy();
    const managerLevel = hierarchy[managerRole]?.level;
    const targetLevel = hierarchy[targetRole]?.level;

    if (!managerLevel || !targetLevel) return false;

    // Higher level (lower number) can manage lower levels (higher numbers)
    return managerLevel < targetLevel;
  }
}

export const roleService = new RoleService(); 