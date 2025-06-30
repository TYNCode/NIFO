import React from 'react';
import { canManageTrends, getUserRole } from '../../utils/localStorageUtils';

interface TrendsRBACWrapperProps {
  children: React.ReactNode;
  requireTYN?: boolean;
  fallback?: React.ReactNode;
}

const TrendsRBACWrapper: React.FC<TrendsRBACWrapperProps> = ({ 
  children, 
  requireTYN = false, 
  fallback = null 
}) => {
  const canManage = canManageTrends();
  const userRole = getUserRole();

  // If TYN role is required and user doesn't have it, show fallback
  if (requireTYN && !canManage) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default TrendsRBACWrapper; 