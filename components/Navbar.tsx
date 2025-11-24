"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import NavbarCategories from "./NavbarCategories";

const Navbar = () => {
  const { status, data: session } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserDropdownOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isUserDropdownOpen]);

  // Click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        event.target instanceof Node &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Click outside handler for user dropdown (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        event.target instanceof Node &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleSignOut = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    signOut();
  };

  return (
    <nav className="border-b bg-white" role="navigation">
      {/* TOP ROW: Logo + User Section (Same Line on Desktop) */}
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 py-4">
        {/* Logo + Tagline */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <h1 className="text-3xl md:text-4xl lg:text-6xl text-blue-950 font-bold my-1 md:my-2">
              DailyNews
            </h1>
          </Link>
          <p className="text-xs md:text-sm text-gray-600">
            Explore World&apos;s Innovations <br className="hidden sm:block" />
            One Byte at a Time
          </p>
        </div>

        {/* User Section - VISIBLE on md+ (Desktop/Tablet) */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <div className="relative" ref={userDropdownRef}>
              {/* Profile Picture with Dropdown Toggle */}
              <button
                onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                aria-label="User menu"
                aria-expanded={isUserDropdownOpen}
              >
                {session?.user?.image && (
                  <Image
                    className="rounded-full border-2 border-blue-950"
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    height={50}
                    width={50}
                  />
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-5 h-5 text-blue-950 transition-transform ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-white shadow-2xl rounded-lg min-w-[200px] z-50 border border-gray-200 transform transition-all duration-200 origin-top-right"
                  style={{
                    transform: isUserDropdownOpen
                      ? "scale(1) opacity(1)"
                      : "scale(0.95) opacity(0)",
                  }}
                >
                  <div className="flex flex-col gap-1 p-2">
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200">
                      {session?.user?.image && (
                        <Image
                          className="rounded-full"
                          src={session.user.image}
                          alt={session.user.name || "Profile"}
                          height={40}
                          width={40}
                        />
                      )}
                      <p className="text-blue-950 text-sm font-bold truncate">
                        {session?.user?.name}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-3 py-2 text-blue-950 text-sm font-semibold hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/publish-news"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-3 py-2 text-blue-950 text-sm font-semibold hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      📝 Post a News
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="bg-blue-950 hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-xl transition-colors min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Hamburger Icon - VISIBLE ONLY on Mobile */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-blue-950"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* CATEGORIES ROW - Desktop/Tablet Only */}
      <div className="hidden md:flex px-4 md:px-6 lg:px-8 py-3 gap-4 md:gap-6 lg:gap-8 border-t border-gray-200 overflow-x-auto scrollbar-hide">
        <NavbarCategories isMobile={false} />
      </div>

      {/* MOBILE MENU/DRAWER */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out"
            style={{
              transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-blue-950">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* User Section in Mobile Menu */}
              <div className="p-6 border-b border-gray-200">
                {status === "authenticated" ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      {session?.user?.image && (
                        <Image
                          className="rounded-full border-2 border-blue-950"
                          src={session.user.image}
                          alt={session.user.name || "Profile"}
                          height={50}
                          width={50}
                        />
                      )}
                      <div>
                        <p className="text-blue-950 text-base font-bold">
                          {session?.user?.name}
                        </p>
                        {session?.user?.email && (
                          <p className="text-sm text-gray-600 truncate">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-950 font-semibold transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        href="/publish-news"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-950 font-semibold transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        📝 Post a News
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Categories in Mobile Menu */}
              <div className="p-6 flex-1">
                <h3 className="text-lg font-bold text-blue-950 mb-4">
                  Categories
                </h3>
                <NavbarCategories isMobile={true} />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
