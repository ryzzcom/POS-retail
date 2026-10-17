"use client";

import * as React from "react";
import { AuthSplitLayout } from "./AuthSplitLayout";
import { SignupForm } from "./SignupForm";

export function SignupView() {
  return (
    <AuthSplitLayout
      title="Join POS"
      subtitle="Just a few details before you dive in!"
      compactHeader
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}

export default SignupView;
