"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import Link from "next/link";
import React, { useState, useContext, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginContext } from "../context/loginContext";
import ProfileMenu, { ProfileMenuItem } from "./ProfileMenu";
import { useSignOut } from "./LogOutButton";
import { useProfile } from "../context/profileContext";
import { useProducts } from "@/app/context/productContext";

function NavBar() {
   const auth = useContext(LoginContext);
   const handleSignOut = useSignOut();
   const { profile } = useProfile();

   const initials = profile?.first_name && profile?.last_name
     ? profile.first_name[0].toUpperCase() + profile.last_name[0].toUpperCase()
     : "US";
   
  const links = [
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Cart",
      path: "/cart",
    },
  ];

  const menu = [
    {
      name: "Wishlist",
      path: "/wishlist",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-heart-icon lucide-heart"
        >
          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
        </svg>
      ),
    },
    {
      name: "My Orders",
      path: "/myorders",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-clipboard-list-icon lucide-clipboard-list"
        >
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11h4" />
          <path d="M12 16h4" />
          <path d="M8 11h.01" />
          <path d="M8 16h.01" />
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-settings-icon lucide-settings"
        >
          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: "Profile",
      path: "/profile",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user-round-icon lucide-user-round"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      ),
    },
  ];
  const [ham, setHam] = useState<boolean>(false);
  const [drop, setDrop] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);

  const { products } = useProducts();

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/products`);
    }
    setHam(false);
    setIsFocused(false);
    setIsMobileFocused(false);
  };

  const suggestions = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery || !products) return [];
    return products.filter((product: any) =>
      product.title?.toLowerCase().includes(trimmedQuery) ||
      product.description?.toLowerCase().includes(trimmedQuery) ||
      product.category?.toLowerCase().includes(trimmedQuery)
    ).slice(0, 6);
  }, [searchQuery, products]);

  return (
    <div className="fixed top-0 font-heading left-0 right-0 z-[99] bg-background border-b-1 border-border text-heading">
      <header className="  mx-auto md:gap-10 max-w-[90%] lg:gap-30 flex justify-between items-center">
        <Link href="/" className="flex-1 py-5 cursor-ppointe">
          <h1 className="text-4xl font-bold text-heading italic flex-1 ">
            {" "}
            EZ<span className="text-primary not-italic">Mart</span>
          </h1>
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden md:flex justify-center items-center py-5 flex-2 relative">
          <div className="  bg-surface rounded-full flex-2 flex items-center overflow-hidden justify-between h-10 border-1 border-border focus-within:border-2 focus-within:border-primary pl-5 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="italic bg-surface text-text h-full w-full focus:outline-none"
              placeholder="Search Products..."
            />

            <button type="submit" className="bg-surface hover:bg-border h-full border-l-1 border-border rounded-r-full px-4 cursor-pointer">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search-icon lucide-search"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>
          </div>

          {isFocused && searchQuery.trim() && (
            <div className="absolute top-[calc(100%-8px)] left-0 right-0 bg-surface border border-border shadow-xl rounded-2xl z-50 max-h-[350px] overflow-y-auto mt-2 py-2">
              {suggestions.length > 0 ? (
                suggestions.map((product: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={() => {
                      router.push(`/products/${product.category}/${product.slug}`);
                      setSearchQuery("");
                      setIsFocused(false);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-border transition-colors duration-150 flex items-center gap-3 border-b last:border-b-0 border-border/40 cursor-pointer"
                  >
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-lg bg-background border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-heading truncate">{product.title}</p>
                      <p className="text-xs text-text-muted truncate capitalize">{product.category}</p>
                    </div>
                    <div className="text-sm font-bold text-primary whitespace-nowrap">
                      ${product.price}
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-text-muted text-sm">
                  No matching products found
                </div>
              )}
            </div>
          )}
        </form>

        {auth?.user && (
          <div className=" justify-between items-center gap-4 h-full flex-1  hidden md:flex ">
            {links.map((link, index) => (
              <div key={index}>
                <Link className="relative group" href={link.path}>
                  {link.name}
                  <hr className="absolute w-full h-1 scale-x-0 group-hover:scale-x-100 transition-all duration-300" />
                </Link>
              </div>
            ))}

            <div
              className="h-full py-5 "
              onMouseEnter={() => setDrop(true)}
              onMouseLeave={() => setDrop(false)}
            >
              <div
                className={`h-10 w-10 relative hover:border-primary transition-all duration-300 bg-heading/30 rounded-full ${drop && "border-4"}`}
              >
                <Avatar className="h-full w-full hover:scale-105">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {drop && (
                  <ProfileMenu>
                    {menu.map((item, index) => (
                      <ProfileMenuItem key={index} href={item.path}>
                        {item.svg}
                        {item.name}
                      </ProfileMenuItem>
                    ))}

                    <ProfileMenuItem href="" onClick={handleSignOut}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-log-out-icon lucide-log-out"
                      >
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      </svg>
                      Log Out
                    </ProfileMenuItem>
                  </ProfileMenu>
                )}
              </div>
            </div>
          </div>
        )}
        {!auth?.user && (
          <div className=" justify-between items-center gap-4 flex-1 font-light hidden md:flex">
            {links.slice(0, 2).map((link, index) => (
              <div key={index}>
                <Link className="relative group" href={link.path}>
                  {link.name}
                  <hr className="absolute w-full h-1 scale-x-0 group-hover:scale-x-100  transition-all duration-300" />
                </Link>
              </div>
            ))}
            <div className="flex gap-2">
              <Link
                href="/sign-up"
                className="py-2 px-4 bg-background text-xs hover:bg-surface font-semibold rounded-lg text-primary border-2 border-border "
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="py-2 px-4 bg-primary rounded-lg text-xs  font-semibold text-surface border-1 border-border
        hover:bg-primary-hover "
                
              >
                Log In
              </Link>
            </div>
          </div>
        )}

        <div className=" md:hidden" onClick={(e) => setHam(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu-icon lucide-menu"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </div>
      </header>

      {/* for smaller screens  */}
      {ham && (
        <div
          className={`fixed left-0 right-0 top-0 bg-background flex  flex-col md:hidden justify-start items-centerS`}
        >
          <div
            className="w-full py-5 px-5 flex justify-between items-center"
            onClick={(e) => setHam(false)}
          >
            <h1 className="text-4xl font-bold text-heading italic flex-1 ">
              {" "}
              EZ<span className="text-primary not-italic">Mart</span>
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x cursor-pointer"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          {/* Mobile search bar */}
          <div className="w-full px-8 py-2 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="bg-surface rounded-full flex items-center overflow-hidden justify-between h-10 border-1 border-border focus-within:border-2 focus-within:border-primary pl-5 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsMobileFocused(true)}
                  onBlur={() => setTimeout(() => setIsMobileFocused(false), 200)}
                  className="italic bg-surface text-text text-sm h-full w-full focus:outline-none"
                  placeholder="Search Products..."
                />
                <button type="submit" className="bg-surface hover:bg-border h-full border-l-1 border-border rounded-r-full px-4 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search-icon lucide-search"
                  >
                    <path d="m21 21-4.34-4.34" />
                    <circle cx="11" cy="11" r="8" />
                  </svg>
                </button>
              </div>
            </form>

            {isMobileFocused && searchQuery.trim() && (
              <div className="absolute left-8 right-8 bg-surface border border-border shadow-xl rounded-2xl z-50 max-h-[280px] overflow-y-auto mt-2 py-2">
                {suggestions.length > 0 ? (
                  suggestions.map((product: any, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={() => {
                        router.push(`/products/${product.category}/${product.slug}`);
                        setSearchQuery("");
                        setIsMobileFocused(false);
                        setHam(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-border transition-colors duration-150 flex items-center gap-3 border-b last:border-b-0 border-border/40 cursor-pointer"
                    >
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-8 h-8 object-cover rounded-lg bg-background border border-border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-heading truncate">{product.title}</p>
                        <p className="text-[10px] text-text-muted truncate capitalize">{product.category}</p>
                      </div>
                      <div className="text-xs font-bold text-primary whitespace-nowrap">
                        ${product.price}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-4 text-center text-text-muted text-xs">
                    No matching products found
                  </div>
                )}
              </div>
            )}
          </div>
          {auth?.user ? 
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full p-8 flex flex-col text-2xl justify-center items-center gap-4 border-b-2  pb-20 border-border"
          >
            {links.map((link, index) => (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ y: -50, opacity: 0 }}
                key={index}
              >
                <Link href={link.path} onClick={() => setHam(false)}>
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {
            menu.map((link, index) => (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ y: -50, opacity: 0 }}
                key={index}
              >
                <Link href={link.path} onClick={() => setHam(false)}>
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <Link href="" className="flex justify-center items-center" onClick={handleSignOut}>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-log-out-icon lucide-log-out"
                      >
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      </svg> */}
                      Log Out
                    </Link>
          </motion.div>
          : 
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full p-8 pb-0 flex flex-col text-2xl justify-center items-center gap-4 border-b-2  pb-20 border-border"
          >
            {links.slice(0,2).map((link, index) => (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ y: -50, opacity: 0 }}
                key={index}
              >
                <Link href={link.path} onClick={() => setHam(false)}>
                  {link.name}
                </Link>
              </motion.div>
            ))}

             <div className="flex w-full flex-col gap-4">
              <Link
                href="/sign-up"
                className="py-2 px-4 bg-background text-center text-lg  hover:bg-surface font-semibold rounded-lg text-primary border-2 border-border "
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="py-2 px-4 bg-primary rounded-lg text-center text-lg font-semibold text-surface border-1 border-border
        hover:bg-primary-hover "
                
              >
                Log In
              </Link>
            </div> 
          </motion.div>}
          
        </div>
      )}
    </div>
  );
}

export default NavBar;
