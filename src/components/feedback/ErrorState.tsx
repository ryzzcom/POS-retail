import React from "react";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={className}>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
}
