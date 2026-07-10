"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useProfile } from "@/app/context/profileContext";
import { useNotification } from "@/app/context/notificationContext";
import {
  User,
  Shield,
  FileText,
  Mail,
  Lock,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
  Palette
} from "lucide-react";
import { useApp, THEMES } from "@/app/context/appContext";

type AddressType = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

export default function SettingsPage() {
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const { showToast } = useNotification();
  const { theme: currentTheme, setTheme } = useApp();

  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "privacy" | "support" | "theme">("account");
  const [savingAccount, setSavingAccount] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [submittingSupport, setSubmittingSupport] = useState(false);

  // Account form states
  const [accountForm, setAccountForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState<AddressType>({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [billingAddress, setBillingAddress] = useState<AddressType>({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Security / Password form state
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  // Notification local preference states
  const [notifications, setNotifications] = useState({
    orders: true,
    security: true,
    newsletter: false,
    offers: true,
  });

  // Customer Support Form state
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "General Inquiry",
    message: "",
  });

  useEffect(() => {
    if (profile) {
      setAccountForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
      });

      if (profile.shipping_address) {
        setShippingAddress({
          street: profile.shipping_address.street || "",
          city: profile.shipping_address.city || "",
          state: profile.shipping_address.state || "",
          country: profile.shipping_address.country || "",
          zip: profile.shipping_address.zip || "",
        });
      }

      if (profile.billing_address) {
        setBillingAddress({
          street: profile.billing_address.street || "",
          city: profile.billing_address.city || "",
          state: profile.billing_address.state || "",
          country: profile.billing_address.country || "",
          zip: profile.billing_address.zip || "",
        });
        // If billing matches shipping or is empty, assume same
        const match =
          JSON.stringify(profile.shipping_address) === JSON.stringify(profile.billing_address) ||
          !profile.billing_address ||
          Object.keys(profile.billing_address).length === 0;
        setSameAsShipping(match);
      }
    }
  }, [profile]);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingAccount(true);

    try {
      const finalBilling = sameAsShipping ? shippingAddress : billingAddress;
      const { error } = await supabase
        .from("users")
        .update({
          first_name: accountForm.first_name,
          last_name: accountForm.last_name,
          phone: accountForm.phone,
          shipping_address: shippingAddress,
          billing_address: finalBilling,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      showToast("Profile settings saved successfully", "success");
      await refreshProfile();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to update profile settings", "error");
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (passwordForm.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.password,
      });

      if (error) throw error;

      showToast("Password updated successfully", "success");
      setPasswordForm({ password: "", confirmPassword: "" });
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setSubmittingSupport(true);
    // Mimic API/DB save time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast("Support ticket submitted! We'll reply within 24 hours.", "success");
    setSupportForm({ subject: "", category: "General Inquiry", message: "" });
    setSubmittingSupport(false);
  };

  if (profileLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="font-semibold text-sm">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-heading tracking-tight font-heading mb-2">
          Dashboard Settings
        </h1>
        <p className="text-text-muted text-sm md:text-base">
          Manage your account profile, delivery preferences, security alerts, and support tickets.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-1/4 bg-surface border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all duration-200 text-left ${
                activeTab === "account"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text hover:bg-background hover:text-heading"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Account & Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all duration-200 text-left ${
                activeTab === "notifications"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text hover:bg-background hover:text-heading"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Security & Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all duration-200 text-left ${
                activeTab === "privacy"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text hover:bg-background hover:text-heading"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all duration-200 text-left ${
                activeTab === "support"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text hover:bg-background hover:text-heading"
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Customer Support</span>
            </button>

            <button
              onClick={() => setActiveTab("theme")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all duration-200 text-left ${
                activeTab === "theme"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text hover:bg-background hover:text-heading"
              }`}
            >
              <Palette className="w-5 h-5" />
              <span>Theme Switcher</span>
            </button>
          </div>
        </aside>

        {/* Setting Panel Content */}
        <main className="w-full lg:w-3/4 bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Tab 1: Account Settings */}
          {activeTab === "account" && (
            <form onSubmit={handleAccountSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-heading font-heading mb-4 pb-2 border-b border-border">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={accountForm.first_name}
                      onChange={(e) => setAccountForm({ ...accountForm, first_name: e.target.value })}
                      placeholder="Enter your first name"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={accountForm.last_name}
                      onChange={(e) => setAccountForm({ ...accountForm, last_name: e.target.value })}
                      placeholder="Enter your last name"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-bold text-heading font-heading mb-4 pb-2 border-b border-border">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      placeholder="Street name and apt/suite number"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      placeholder="ZIP code"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      placeholder="Country"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address Toggle */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="sameAsShippingSettings"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="sameAsShippingSettings" className="text-sm font-semibold cursor-pointer text-heading">
                  Billing Address matches Shipping Address
                </label>
              </div>

              {/* Billing Address */}
              {!sameAsShipping && (
                <div className="space-y-6 pt-4 border-t border-border animate-fadeIn">
                  <h2 className="text-2xl font-bold text-heading font-heading mb-4">
                    Billing Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={billingAddress.street}
                        onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                        placeholder="Billing Street name and apt/suite number"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        placeholder="City"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                        placeholder="State"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        value={billingAddress.zip}
                        onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
                        placeholder="ZIP code"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                        placeholder="Country"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingAccount}
                  className="bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  {savingAccount ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Security & Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-10">
              {/* Security - Password Change */}
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-heading font-heading mb-2">
                    Security Settings
                  </h2>
                  <p className="text-xs text-text-muted mb-6">
                    Change your account password. Ensure your new password is secure.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-b border-border pb-8">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>

              {/* Notification Preferences */}
              <div>
                <h2 className="text-2xl font-bold text-heading font-heading mb-2">
                  Notifications & Alerts
                </h2>
                <p className="text-xs text-text-muted mb-6">
                  Select which notification emails you want to receive.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="max-w-[80%]">
                      <p className="font-bold text-heading text-sm">Order status updates</p>
                      <p className="text-xs text-text-muted mt-1">
                        Receive real-time transactional emails about checkout status, shipping updates, and deliveries.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={notifications.orders}
                        onChange={(e) => setNotifications({ ...notifications, orders: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="max-w-[80%]">
                      <p className="font-bold text-heading text-sm">Security & System Alerts</p>
                      <p className="text-xs text-text-muted mt-1">
                        Get notified of updates to policies, terms, new logins, or potential account activity changes.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={notifications.security}
                        onChange={(e) => setNotifications({ ...notifications, security: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="max-w-[80%]">
                      <p className="font-bold text-heading text-sm">Weekly Newsletter</p>
                      <p className="text-xs text-text-muted mt-1">
                        Stay up to date with new store products, tech showcases, and staff-favorite collections.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={notifications.newsletter}
                        onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="max-w-[80%]">
                      <p className="font-bold text-heading text-sm">Special offers & Discounts</p>
                      <p className="text-xs text-text-muted mt-1">
                        Receive personalized notifications for seasonal sales, birthday discounts, and exclusive codes.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={notifications.offers}
                        onChange={(e) => setNotifications({ ...notifications, offers: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Privacy Policy */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-heading font-heading mb-2">
                  Privacy Policy
                </h2>
                <p className="text-xs text-text-muted mb-6">
                  Last Updated: July 10, 2026
                </p>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 border-t border-border pt-6 text-text leading-relaxed text-sm">
                <section className="space-y-2">
                  <h3 className="text-base font-bold text-heading font-heading">1. Introduction</h3>
                  <p>
                    Welcome to EZ Mart. We are committed to protecting your personal information and your right to privacy.
                    If you have any questions or concerns about this privacy notice or our practices with regard to your personal
                    information, please contact us at <strong>privacy@ezmart.in</strong>.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-bold text-heading font-heading">2. Information We Collect</h3>
                  <p>
                    We collect personal information that you voluntarily provide to us when you register on our website, express
                    an interest in obtaining information about us or our products, or when you place an order.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Personal Details:</strong> Names, phone numbers, email addresses, mailing addresses.</li>
                    <li><strong>Credentials:</strong> Passwords, security questions, or similar security details used for authentication.</li>
                    <li><strong>Payment Data:</strong> Financial details matching your orders and card/billing information.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-bold text-heading font-heading">3. How We Use Your Information</h3>
                  <p>
                    We process your information for purposes based on legitimate business interests, the fulfillment of our contract
                    with you, compliance with our legal obligations, and/or your consent.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To facilitate account creation, login, and profile maintenance.</li>
                    <li>To fulfill and manage your orders, payments, returns, and exchanges.</li>
                    <li>To send marketing, promotional updates, and security alerts.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-bold text-heading font-heading">4. Data Protection & Security</h3>
                  <p>
                    We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-bold text-heading font-heading">5. Your Privacy Rights</h3>
                  <p>
                    You may review, change, or terminate your account at any time. Depending on your location, you may have the right to request access to and obtain a copy of your personal information, request rectification, or request erasure.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* Tab 4: Customer Support */}
          {activeTab === "support" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-heading font-heading mb-2">
                  Customer Support
                </h2>
                <p className="text-xs text-text-muted mb-6">
                  Need assistance? Submit a ticket below, or use our contact details to reach out.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background border border-border rounded-2xl flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Phone</p>
                    <p className="text-xs font-semibold text-heading">+91 000 111 999</p>
                  </div>
                </div>

                <div className="p-4 bg-background border border-border rounded-2xl flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Email</p>
                    <p className="text-xs font-semibold text-heading">support@ezmart.in</p>
                  </div>
                </div>

                <div className="p-4 bg-background border border-border rounded-2xl flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Hours</p>
                    <p className="text-xs font-semibold text-heading">9 AM - 6 PM, Mon-Sat</p>
                  </div>
                </div>
              </div>

              {/* Submit Ticket Form */}
              <form onSubmit={handleSupportSubmit} className="space-y-6 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-heading font-heading mb-4">
                  Submit a Support Ticket
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Inquiry Category
                    </label>
                    <select
                      value={supportForm.category}
                      onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    >
                      <option>General Inquiry</option>
                      <option>Order Issue</option>
                      <option>Technical Support</option>
                      <option>Returns & Refund</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                      placeholder="Brief summary of the issue"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                      placeholder="Describe your query or issue in detail..."
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingSupport}
                    className="bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    {submittingSupport ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 5: Theme Switcher */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-heading font-heading mb-2">
                  Theme Switcher
                </h2>
                <p className="text-xs text-text-muted mb-6">
                  Select a theme to customize the look and feel of the entire store application.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-border pt-6">
                {Object.entries(THEMES).map(([key, themeInfo]) => {
                  const isActive = currentTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key);
                        showToast(`Theme changed to ${themeInfo.name}`, "success");
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isActive
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-background/50 hover:bg-background"
                      }`}
                    >
                      {/* Square Color Icon */}
                      <div
                        className="w-10 h-10 rounded-xl shrink-0 border border-black/10 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: themeInfo.primaryColor }}
                      >
                        {/* Little inset showing background color */}
                        <div
                          className="w-4 h-4 rounded-md border border-white/20"
                          style={{ backgroundColor: themeInfo.bgColor }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-heading text-sm truncate">{themeInfo.name}</p>
                        <p className="text-[10px] text-text-muted font-semibold uppercase mt-0.5 tracking-wider">
                          {themeInfo.isDark ? "Dark Mode" : "Light Mode"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
