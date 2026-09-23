import React from 'react';
import { PageHeader, PageHeaderProps } from './PageHeader';

export interface PageContainerProps extends PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  action,
  breadcrumbs,
  children,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-6 max-w-[1600px] mx-auto w-full ${className}`}>
      <PageHeader title={title} subtitle={subtitle} action={action} breadcrumbs={breadcrumbs} />
      {children}
    </div>
  );
};
