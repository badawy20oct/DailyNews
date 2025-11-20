'use client'; 

import React from 'react'
import Image from 'next/image';
import { signIn } from "next-auth/react";


function SignInPage() {
  return (
  <>
  <h1 className='text-center mt-8 text-2xl font-bold'>Sign In</h1>
  <div className=' m-4 flex flex-col items-center justify-center'>
    <button onClick={() => signIn("github")} className='flex items-center border p-4 rounded-full gap-6 hover:bg-slate-100/25 transition hover:cursor-pointer'>
        <span>
            <Image
            src = {'/github-mark.svg'}
            width ={30}
            height ={30}
            alt = 'GitHub Logo'
            />
        </span>
        Sign in with GitHub
    </button>
  </div>
  <div className='flex flex-col items-center justify-center'>
    <button onClick={() => signIn("google")} className='flex items-center border p-4 rounded-full gap-6 hover:bg-slate-100/25 transition hover:cursor-pointer'>
        <span>
            <Image
            src = {'/7123025_logo_google_g_icon.png'}
            width ={30}
            height ={30}
            alt = 'Google Logo'
            />
        </span>
        Sign in with Google
    </button>
  </div>
  </>
  )
}

export default SignInPage
