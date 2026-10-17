"use client";

import * as React from "react";
import { AuthSplitLayout } from "./AuthSplitLayout";
import { OtpForm } from "./OtpForm";

export function OtpView() {
  return (
    <AuthSplitLayout
      title="Verify OTP"
      subtitle="Enter the 6 digit code sent to your email and phone."
    >
      <OtpForm />
    </AuthSplitLayout>
  );
}

export default OtpView;
