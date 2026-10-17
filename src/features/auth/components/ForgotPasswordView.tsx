"use client";

import * as React from "react";
import { AuthSplitLayout } from "./AuthSplitLayout";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function ForgotPasswordView() {
  return (
    <AuthSplitLayout
      title="Forgot Password"
      subtitle="Please enter your registered email address"
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}

export default ForgotPasswordView;
