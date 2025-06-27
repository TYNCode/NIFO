import { useState, useEffect } from 'react';
import { canManageTrends, canReadTrends, getUserRole } from '../utils/localStorageUtils';

export const useTrendsPermissions = () => {
  const [canManage, setCanManage] = useState(false);
  const [canRead, setCanRead] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setCanManage(canManageTrends());
    setCanRead(canReadTrends());
    setUserRole(getUserRole());
  }, []);

  return {
    canManage,
    canRead,
    userRole,
    isTYNUser: canManage,
    isEnterpriseUser: userRole === 'enterprise',
    isStartupUser: userRole === 'startup',
  };
}; 