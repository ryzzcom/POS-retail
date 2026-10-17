"use client";

import * as React from "react";
import { AuthSplitLayout } from "./AuthSplitLayout";
import { LoginForm } from "./login-form";

export function LoginView() {
  return (
    <AuthSplitLayout
      title="Welcome back"
      subtitle="Please enter your details to sign in."
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}

export default LoginView;
