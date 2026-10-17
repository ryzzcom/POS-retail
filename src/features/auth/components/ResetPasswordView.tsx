"use client";

import * as React from "react";
import { AuthSplitLayout } from "./AuthSplitLayout";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordView() {
  return (
    <AuthSplitLayout
      title="Reset Your Password"
      subtitle="Almost done, please create a new password"
    >
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}

export default ResetPasswordView;
