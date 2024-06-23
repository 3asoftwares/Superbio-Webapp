"use client";
import DynamicLogo from "@/components/DynamicLogo";
import { useAppDispatch } from "@/context";
import { loginUsingGoogle } from "@/context/user/network";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentBackground, setCurrentBackground] =
    React.useState("/images/login.png");
  const pathname = usePathname();
  const [buttonText, setButtonText] = React.useState("Sign up");
  const [buttonLink, setButtonLink] = React.useState("/register");
  const [buttonBeforeText, setButtonBeforeText] =
    React.useState("Not a member? ");
  const [text, setText] = React.useState("Welcome to Loqo ai");
  const dispatch = useAppDispatch();


  React.useEffect(() => {
    if (pathname === "/login") {
      setCurrentBackground("/images/login.png");
      setButtonText("Sign up");
      setButtonLink("/register");
      setButtonBeforeText("Not a member? ");
      setText("Welcome to Loqo ai");
    } else if (pathname === "/register" || pathname === "/setup") {
      setCurrentBackground("/images/signup.png");
      setButtonText("Sign in");
      setButtonLink("/login");
      setButtonBeforeText("Already a member? ");
      setText("Welcome to Loqo ai");
    } else {
      setCurrentBackground("/images/reset.png");
      setButtonText("Sign in");
      setButtonLink("/login");
      setButtonBeforeText("Already a member? ");
      setText("Reset your password");
    }
  }, [pathname]);

  useGoogleOneTapLogin({
    onSuccess: (creads) => {
      dispatch(
        loginUsingGoogle({
          token: creads.credential as string,
          tokenType: "id_token",
        })
      );
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (creads) => {
      dispatch(
        loginUsingGoogle({
          token: creads.access_token,
          tokenType: "access_token",
        })
      );
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
      <div className='flex w-full h-screen '>
          <div className='flex flex-1 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${currentBackground})` }}></div>
          <div className='flex flex-1'>
              <div className='flex w-full h-full justify-center items-center'>
                  <div className='flex absolute top-0 right-0 p-5 items-center space-x-3'>
                      <span className='text-sm'>{buttonBeforeText} </span>
                      <Link href={buttonLink} className='flex capitalize items-center text-xs p-2 px-5 border border-black rounded-lg'>
                          {buttonText} <BsArrowRight className='ml-2' size={20} />
                      </Link>
                  </div>
                  <div className='flex sm:w-[80%] w-[90%] flex-col'>
                      <div className='flex items-center space-x-3'>
                          <DynamicLogo />
                          <Link href={'/'}>
                              <span className=' uppercase text-xl font-bold'>Business</span>
                          </Link>
                      </div>
                      <div className='flex text-4xl font-bold mt-4'>{text}</div>

                      <div className='flex flex-col mt-6'>{children}</div>
                      <div className=' w-full mt-5 rounded-lg'>
                          <button
                              className='w-full border p-2 rounded-lg border-black flex space-x-4 justify-center items-center'
                              onClick={() => {
                                  googleLogin();
                              }}>
                              <span className='cursor-pointer'>
                                  <FcGoogle size={25} />
                              </span>
                              <span>{pathname === '/login' ? 'Login' : 'Signup'} With Google</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
