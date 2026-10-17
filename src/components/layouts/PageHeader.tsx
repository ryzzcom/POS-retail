import React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={className}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
