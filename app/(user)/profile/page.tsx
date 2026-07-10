import React from "react";
import { fetchUserProfile } from "@/app/lib/supabaseServer";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import LogoutButton from "@/app/components/LogOutButton";

const page = async () => {
  const user = await fetchUserProfile();
  const billingAddress = user?.billing_address;
  const shippingAddress = user?.shipping_address;
  const initials = user?.first_name && user?.last_name
  ? user.first_name[0].concat(user.last_name[0])
  : "US";

  return (
    <div className="min-h-screen bg-background pt-30 py-20 px-20 text-heading">
      <div className="w-full h-full flex flex-col justify-center gap-8 rounded-4xl p-10 bg-white border-2 border-border">
        <header className="w-full">
          <h1 className="text-5xl w-full text-center tracking-[0.025em] font-bold">
            User Profile
          </h1>
        </header>

        <section id="personal details" className="flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-32 border-b border-border pb-16">
          <div className="flex justify-center items-center">
            <Avatar className="h-40 w-40 md:h-56 md:w-56 lg:h-80 lg:w-80 xl:h-96 xl:w-96 border-4 border-border text-6xl md:text-7xl lg:text-7xl xl:text-8xl hover:scale-105 transition-transform duration-200">
              <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase">
                {initials || "US"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 flex flex-col gap-8 lg:gap-14 text-center md:text-left">
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Full Name</span>
              <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-2xl font-black mt-3 leading-tight">{user?.first_name} {user?.last_name}</h2>
            </div>
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Email Address</span>
              <p className="text-xl md:text-3xl lg:text-3xl xl:text-2xl font-medium mt-3 break-all">{user?.email}</p>
            </div>
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Account Role</span>
              <div className="mt-3">
                <span className="inline-block bg-primary/10 text-primary text-base md:text-lg lg:text-2xl xl:text-2xl px-8 py-4 rounded-full font-black uppercase">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="addresses" className="flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-20 border-b border-border pb-16">
          
          
          <div className="flex-1 flex flex-col gap-8  text-center md:text-left">
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-heading uppercase">Shipping address</span>
            </div>
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Street & City</span>
              <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-4xl font-black mt-3 leading-tight">{shippingAddress?.street}, {shippingAddress?.city}</h2>
            </div>
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">State & Country</span>
              <p className="text-xl md:text-3xl lg:text-3xl xl:text-4xl font-medium mt-3 break-all">{shippingAddress?.state}, {shippingAddress?.country}</p>
            </div>
              <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Zip</span>
              <p className="text-xl md:text-3xl lg:text-3xl xl:text-4xl font-medium mt-3 break-all">{shippingAddress?.zip}</p>
            </div>
           
          </div>

          <div className="flex-1 flex flex-col gap-8  text-center md:text-left">
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-heading uppercase">Billing address</span>
            </div>
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Street & City</span>
              <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-4xl font-black mt-3 leading-tight">{billingAddress?.street}, {billingAddress?.city}</h2>
            </div>
            <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">State & Country</span>
              <p className="text-xl md:text-3xl lg:text-3xl xl:text-4xl font-medium mt-3 break-all">{billingAddress?.state}, {billingAddress?.country}</p>
            </div>
              <div>
              <span className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-wider text-gray-500">Zip</span>
              <p className="text-xl md:text-3xl lg:text-3xl xl:text-4xl font-medium mt-3 break-all">{billingAddress?.zip}</p>
            </div>
           
          </div>
        </section>

        <section id="account-actions" className="flex justify-end pt-4 border-b border-border pb-8">
         <LogoutButton/>
        </section>

        <section id="danger-zone" className="flex flex-col gap-6 pt-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-red-600 tracking-wide uppercase">Danger Zone</h2>
            <p className="text-text-muted mt-2 text-sm md:text-base">
              Irreversible actions for your account. Please proceed with caution.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-2 border-red-100 bg-red-50/30 rounded-3xl gap-6">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-heading">Delete Account</h3>
              <p className="text-text mt-1 text-sm md:text-base">
                Once you delete your account, all of your profile information, order history, and settings will be permanently removed. This action cannot be undone.
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm md:text-base px-6 py-4 rounded-2xl transition-all duration-200 cursor-pointer shadow-md shadow-red-200 hover:shadow-red-300">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
