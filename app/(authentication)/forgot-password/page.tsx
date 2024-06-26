"use client"
import { useAppDispatch, useAppSelector } from "@/context";
import { setUser } from "@/context/user";
import UserNetworkService from "@/services/user.service";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";
import { BsArrowRight } from "react-icons/bs";

export default function ForgetPassword() {
  const {user} = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const {enqueueSnackbar} = useSnackbar()
  const router = useRouter()

  const setKeyAndValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const copyUser = JSON.parse(JSON.stringify(user));
    copyUser[e.target.name] = e.target.value;
    dispatch(setUser(copyUser));
  };

  const forgetPassword = () => {
    UserNetworkService.instance.forgotPassword(user.email).then(res => {
      enqueueSnackbar("Mail sent successfully", {variant: "success"})
    }).catch(err => {
      enqueueSnackbar("Error in sending mail", {variant: "error"})
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <label htmlFor="email">
          <span className="text-xs font-semibold capitalize">Email id</span>
        </label>
        <input
          type="text"
          className="bg-[#F7F7F7] outline-none text-sm p-3 px-4 mt-1 rounded-md"
          placeholder="hello@loqo.ai"
          name="email"
          value={user.email}
          onChange={setKeyAndValue}
        />
      </div>

      <div className="flex flex-col mt-6">
        <button onClick={forgetPassword} className="flex capitalize items-center font-semibold justify-center text-white text-xs p-3 px-5 border bg-black rounded-lg">
          Send recovery mail <BsArrowRight className="ml-2" size={20} />
        </button>
      </div>

    </div>
  );
}
