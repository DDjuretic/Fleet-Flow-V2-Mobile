/**
 * TierGuard Component - Conditional rendering based on user tier permissions
 * Guards UI elements and features based on user access level
 */

import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { FeaturePermissions } from '../types/userTier';

interface TierGuardProps {
  children: React.ReactNode;
  permission?: keyof FeaturePermissions;
  requireTier?: import('../types/userTier').UserTier[];
  fallback?: React.ReactNode;
  hide?: boolean; // If true, hide element instead of not rendering
}

/**
 * Guards content based on user tier permissions
 * If permission is not granted, renders fallback or nothing
 */
export const TierGuard: React.FC<TierGuardProps> = ({
  children,
  permission,
  requireTier,
  fallback = null,
  hide = false
}) => {
  const { hasPermission, userTier } = useAuth();

  // Check permission
  if (permission && !hasPermission(permission)) {
    return hide ? <View style={{ display: 'none' }}>{children}</View> : fallback;
  }

  // Check required tier
  if (requireTier && !requireTier.includes(userTier)) {
    return hide ? <View style={{ display: 'none' }}>{children}</View> : fallback;
  }

  return <>{children}</>;
};

/**
 * Shows content only for specific user tiers
 */
export const TierOnly: React.FC<{
  children: React.ReactNode;
  tiers: import('../types/userTier').UserTier[];
  fallback?: React.ReactNode;
}> = ({ children, tiers, fallback = null }) => {
  const { userTier } = useAuth();

  if (!tiers.includes(userTier)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hides content for specific user tiers
 */
export const TierExcept: React.FC<{
  children: React.ReactNode;
  tiers: import('../types/userTier').UserTier[];
  fallback?: React.ReactNode;
}> = ({ children, tiers, fallback = null }) => {
  const { userTier } = useAuth();

  if (tiers.includes(userTier)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Feature toggle based on permissions
 */
export const FeatureToggle: React.FC<{
  feature: keyof FeaturePermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ feature, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
