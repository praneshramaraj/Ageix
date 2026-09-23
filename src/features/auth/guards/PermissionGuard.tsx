import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Permission, ROLE_PERMISSIONS } from '../../../types/auth';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, children, fallback = null }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <>{fallback}</>;
  const userPerms = ROLE_PERMISSIONS[user.role] || [];
  if (!userPerms.includes(permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
