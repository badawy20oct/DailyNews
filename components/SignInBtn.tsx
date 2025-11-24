'use client'; 

import React from 'react'
import Image from 'next/image';
import { signIn } from "next-auth/react";


function SignInPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">
      <h1 className='text-center mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl font-bold text-blue-950'>
        Sign In
      </h1>
      <div className='flex flex-col items-stretch gap-4 sm:gap-6'>
        <button 
          onClick={() => signIn("github")} 
          className='flex items-center justify-center border-2 border-gray-300 p-4 sm:p-5 rounded-xl sm:rounded-2xl gap-4 sm:gap-6 hover:bg-slate-100/50 transition-all hover:border-gray-400 min-h-[56px] sm:min-h-[60px] text-sm sm:text-base md:text-lg font-semibold'
        >
          <Image
            src={'/github-mark.svg'}
            width={28}
            height={28}
            alt='GitHub Logo'
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
          <span>Sign in with GitHub</span>
        </button>
        <button 
          onClick={() => signIn("google")} 
          className='flex items-center justify-center border-2 border-gray-300 p-4 sm:p-5 rounded-xl sm:rounded-2xl gap-4 sm:gap-6 hover:bg-slate-100/50 transition-all hover:border-gray-400 min-h-[56px] sm:min-h-[60px] text-sm sm:text-base md:text-lg font-semibold'
        >
          <Image
            src={'/7123025_logo_google_g_icon.png'}
            width={28}
            height={28}
            alt='Google Logo'
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}

export default SignInPage
