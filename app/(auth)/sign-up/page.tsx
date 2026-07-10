"use client";
import React, { useContext, useState } from "react";
import { LoginContext } from "@/app/context/loginContext";
import { redirect, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

import { useNotification } from "@/app/context/notificationContext";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);

  const [pwdValidation, setPwdValidation] = useState({
    length: false,
    specialChar: false,
    number: false,
    uppercase: false,
    lowercase: false,
  });

  const auth = useContext(LoginContext);
  const router = useRouter();
  const { showToast } = useNotification();

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPwdValidation({
      length: val.length >= 8,
      specialChar: /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/.test(val),
      number: /\d/.test(val),
      uppercase: /[A-Z]/.test(val),
      lowercase: /[a-z]/.test(val),
    });
  };

  const handleSignup = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const isPasswordSecure = 
      pwdValidation.length &&
      pwdValidation.specialChar &&
      pwdValidation.number &&
      pwdValidation.uppercase &&
      pwdValidation.lowercase;

    if (!isPasswordSecure) {
      showToast("Password does not meet the security testcases.", "error");
      return;
    }

    if (password !== rePassword) {
      setMatchPwd(true);
      setPassword("");
      setRePassword("");
      return;
    }

    if (!agreed) {
      showToast("You must agree to the Terms and Conditions.", "error");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName, 
          last_name: lastName, 
          role: "customer",
        },
      },
    });
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Sign up successful! Please check your email for verification or log in.", "success");
      router.push("/login");
    }
  };
  return (
    <div className="h-full w-full bg-background flex justify-center items-center">
      <div
        aria-label="login container"
        className={`flex flex-col border-2 border-border shadow-[0_0_4px] gap-4  shadow-border py-8  px-8 md:px-4 rounded-2xl bg-surface ${matchPwd && "shadow-red-800"}`}
      >
        <div
          aria-label="headings"
          className="flex w-full p-2 flex-col gap-4 justify-center items-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-heading italic w-full text-center ">
            {" "}
            EZ<span className="text-primary not-italic">Mart</span>
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-heading w-full text-center ">
            Sign Up
          </h1>
        </div>
        <form onSubmit={handleSignup}
          aria-label="input container"
          className="flex flex-col w-full gap-6 lg:gap-8 lg:p-6 justify-center items-center"
        >
          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label
              className="md:text-center md:w-40"
              htmlFor="first name input"
            >
              First Name:
            </label>
            <input
              type="text"
              id="first name input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter a Username..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label className="md:text-center md:w-40" htmlFor="last name input">
              Last Name:
            </label>
            <input
              type="text"
              id="last name input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter a Username..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label className="md:text-center md:w-40" htmlFor="email input">
              E-mail:
            </label>
            <input
              type="email"
              id="email input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter your email..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  md:items-center relative  text-heading">
            <label className="md:text-center md:w-40" htmlFor="password input">
              Password:
            </label>
            <input
              type="password"
              value={password}
              id="password input"
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
               p-2  rounded-lg focus:outline-none"
              placeholder="Enter your password..."
              required
            />
          </div>

          {/* Password complexity checklist */}
          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3 text-heading mt-1">
            <div className="hidden md:block md:w-40 shrink-0" />
            <div className="w-full max-w-75 md:max-w-140 text-xs text-text-muted grid grid-cols-2 gap-1.5 px-2 md:px-0 text-left">
              <span className={pwdValidation.length ? "text-green-500 font-medium" : "text-text-muted/60"}>
                {pwdValidation.length ? "✓" : "○"} Min 8 characters
              </span>
              <span className={pwdValidation.uppercase ? "text-green-500 font-medium" : "text-text-muted/60"}>
                {pwdValidation.uppercase ? "✓" : "○"} One uppercase letter
              </span>
              <span className={pwdValidation.lowercase ? "text-green-500 font-medium" : "text-text-muted/60"}>
                {pwdValidation.lowercase ? "✓" : "○"} One lowercase letter
              </span>
              <span className={pwdValidation.number ? "text-green-500 font-medium" : "text-text-muted/60"}>
                {pwdValidation.number ? "✓" : "○"} One digit (0-9)
              </span>
              <span className={pwdValidation.specialChar ? "text-green-500 font-medium" : "text-text-muted/60"}>
                {pwdValidation.specialChar ? "✓" : "○"} One special character
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  md:items-center relative  text-heading">
            <label
              className="md:text-center md:w-40"
              htmlFor="re-password input"
            >
              Re type Password:
            </label>
            <input
              type="password"
              value={rePassword}
              id="re-password input"
              onChange={(e) => setRePassword(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
               p-2  rounded-lg focus:outline-none"
              placeholder="Re-enter your password..."
              required
            />
            {matchPwd && (
              <p className="absolute text-red-600 text-sm md:text-base bottom-[-25] lg:bottom-[-30] right-32">
                Passwords do not match!
              </p>
            )}
          </div>

          {/* Terms and conditions agreement checkbox */}
          <div className="flex items-center justify-center gap-2.5 w-full md:w-2/3 px-4 md:px-0 text-heading">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded-sm focus:ring-primary focus:ring-2 cursor-pointer"
              required
            />
            <label htmlFor="terms-checkbox" className="text-sm select-none cursor-pointer">
              I agree to the{" "}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTerms(true);
                }}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Terms and Conditions
              </span>
            </label>
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  justify-center md:items-center  text-heading">
            <button
              className="bg-primary text-background px-6 py-2 w-full rounded-lg hover:bg-primary-hover text-lg mt-3 lg:mt-0 sm:text-2xl"
              type="submit"
            >
              Sign Up
            </button>
          </div>

          <div className="text-center text-sm text-text-muted mt-4">
            Already have an account?{" "}
            <Link href="/login" prefetch={false} className="text-primary hover:underline font-semibold">
              Log In
            </Link>
          </div>
        </form>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border-2 border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl text-heading">
            <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">Terms and Conditions</h2>
            <div className="max-h-60 overflow-y-auto pr-2 text-sm text-text-muted space-y-4 font-light leading-relaxed">
              <p>Welcome to EZ Mart. By creating an account, you agree to comply with and be bound by the following terms of use:</p>
              <p>1. <strong>Use of Service</strong>: You agree to provide true, accurate, and complete registration information.</p>
              <p>2. <strong>Account Protection</strong>: You are responsible for keeping your login credentials and password confidential.</p>
              <p>3. <strong>Prohibited Conduct</strong>: You may not use this platform to conduct any fraudulent activities, distribute malware, or abuse site resources.</p>
              <p>4. <strong>Updates to Terms</strong>: EZ Mart reserves the right to modify these terms at any time. Continued use of the platform constitutes agreement to changes.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
