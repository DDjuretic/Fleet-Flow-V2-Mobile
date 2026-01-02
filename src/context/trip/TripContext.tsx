import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { TripState, TripAction } from './types';
import { tripReducer, initialTripState } from './tripReducer';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPEED_LIMIT_KEY = 'user_speed_limit_pref';

// 1. Create Context
export const TripContext = createContext<
  | {
      state: TripState;
      dispatch: React.Dispatch<TripAction>;
    }
  | undefined
>(undefined);

// 2. Provider Component
export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(tripReducer, initialTripState);

  // 🏎️ Persistence: Load speed limit and server toggle on startup
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedLimit = await AsyncStorage.getItem(SPEED_LIMIT_KEY);
        const savedServerToggle = await AsyncStorage.getItem('use_speed_limit_server_pref');

        if (savedLimit !== null) {
          dispatch({ type: 'SET_SPEED_LIMIT', payload: parseInt(savedLimit, 10) });
        }
        if (savedServerToggle !== null) {
          dispatch({ type: 'SET_USE_SPEED_LIMIT_SERVER', payload: savedServerToggle === 'true' });
        }
      } catch (e) {
        console.error('Failed to load preferences', e);
      }
    };
    loadPreferences();
  }, []);

  // 🏎️ Persistence: Save preferences when they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem(SPEED_LIMIT_KEY, state.speedLimit.toString());
        await AsyncStorage.setItem(
          'use_speed_limit_server_pref',
          state.useSpeedLimitServer.toString()
        );
      } catch (e) {
        console.error('Failed to save preferences', e);
      }
    };

    // Don't save if state is just initializing with 0/false (simplified check)
    savePreferences();
  }, [state.speedLimit, state.useSpeedLimitServer]);

  return <TripContext.Provider value={{ state, dispatch }}>{children}</TripContext.Provider>;
};

// 3. Custom Hook
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
