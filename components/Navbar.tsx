"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { status, data: session } = useSession();
  const [isPopupvisiable, setisPopupvisiable] = useState(false);
  const popupRef = useRef<null>(null);

  useEffect(() => {
    const handleclickoutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        e.target instanceof Node &&
        !popupRef.current.contains(e.target)
      ) {
        setisPopupvisiable(false);
      }
    };
    document.addEventListener("click", handleclickoutside);
    if (!isPopupvisiable) {
      document.removeEventListener("click", handleclickoutside);
    }
    return () => {
      document.removeEventListener("click", handleclickoutside);
    };
  }, [isPopupvisiable]);

  return (
    <nav className="flex justify-between items-center pb-4 mb-4 border-b relative">
      <div>
        <Link href={"/"}>
          {" "}
          <h1 className="text-6xl text-blue-950 font-bold my-2">DailyNews</h1>{" "}
        </Link>
        <p className="text-sm">
          Explore World's Innovations <br /> One Byte at a Time
        </p>
      </div>
      {status === "authenticated" ? (
        <>
          <div
            ref={popupRef}
            className={`absolute z-30 right-27 top-0 bg-white p-6 shadow-lg rounded-md flex flex-col gap-2 text-write min-w-[250px] ${
              isPopupvisiable ? "flex" : "hidden"
            }`}
          >
            <p className="ml-3 text-blue-950 text-md font-bold">
              {session?.user?.name}
            </p>
            <ul className="list-disc pl-5">
              <li>
                <Link
                  onClick={() => setisPopupvisiable(false)}
                  className="ml-3 text-blue-950 text-md font-bold hover:underline"
                  href={"/dashboard"}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setisPopupvisiable(false)}
                  className="ml-3 text-blue-950 text-md font-bold hover:underline"
                  href={"/publish-news"}
                >
                  {" "}
                  Post a News
                </Link>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => signOut()}
              className="btn cursor-pointer"
            >
              Log Out
            </button>
          </div>
          {session?.user?.image && (
            <div className=" w-[100px] h-[100px]  rounded-full flex justify-center items-center ">
              {!isPopupvisiable ? (
                <span
                  onClick={() => setisPopupvisiable(!isPopupvisiable)}
                  className="mr-2 mt-3 cursor-pointer none "
                >
                  {/* Icon for popup*/}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              ) : (
                <span
                  onClick={() => setisPopupvisiable(!isPopupvisiable)}
                  className="mr-2 mt-3 cursor-pointer hidden"
                >
                  {/* Icon for popup*/}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              )}
              <Image
                className="rounded-full right-40 top-2 cursor-pointer "
                src={session.user.image}
                alt="profile image"
                height={70}
                width={70}
                objectFit="contain"
                onClick={() => {
                  setisPopupvisiable(!isPopupvisiable);
                }}
              />
            </div>
            
            
          )}
        </>
      ) : (
        <div className="mt-8">
          <Link className="btn rounded-xl" href={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
