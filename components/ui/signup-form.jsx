"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
import {
  IconBrandGoogle
} from "@tabler/icons-react";
import { useState } from "react";
import LoginDrawer from "@/components/loginDrawer/LoginDrawer"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
const [isOpen, setIsOpen] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [firstname, setFirstname] = useState("");
const [lastname, setLastname] = useState("");
const[confirmPassword, setConfirmPassword] = useState("");

const [errors, setErrors] = useState({
  firstname: false,
  lastname: false,
  email: false,
  password: false,
  confirmPassword: false,
});

  const handleSubmit = async(e) => {
    e.preventDefault();
    let newErrors = {
      firstname: firstname.trim() === "",
      lastname: lastname.trim() === "",
      email: email.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "" || confirmPassword !== password,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).includes(true)) {
      return;
    }
    else{
      const fullName = `${firstname} ${lastname}`.trim();
  
      try {
        const response = await axios.post("http://localhost:3000/api/signup", {
            userName:fullName,
            email,
            password,
        });
        console.log(response.status);
        if (response.status === 200) {
          toast.success("Signed up successfully!");
          setIsOpen(true);
          console.log("Form submitted");
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
              toast.error("Check your email and password");
            } else if (error.response.status === 409) {
              toast.error("Email already exists");
            } else {
              toast.error("Something went wrong. Please try again later.");
            }
        }
      }
    }

  };
 
  return (
    (<div 
    className="h-full w-full mx-auto flex items-center justify-center p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <form className="" onSubmit={handleSubmit}>
        <div
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" className={errors.firstname ? "border-red-500" : ""} value={firstname} onChange={(e)=>setFirstname(e.target.value)}/>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" value={lastname}  className={errors.lastname ? "border-red-500" : ""} onChange={(e)=>setLastname(e.target.value)} />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={email} className={errors.email ? "border-red-500" : ""} onChange={(e)=>setEmail(e.target.value)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={password}  className={errors.password ? "border-red-500" : ""} onChange={(e)=>setPassword(e.target.value)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmpassword">confirm password</Label>
          <Input id="confirmpassword" placeholder="••••••••" type="confirmpassword" value={confirmPassword}  className={errors.confirmPassword ? "border-red-500" : ""} onChange={(e)=>setConfirmPassword(e.target.value)} />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>
        <Toaster richColors position="top-center" />
        <div
          className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-3 h-[1px] w-full" />
        
        <div className="flex w-full items-center justify-center gap-2">
          <div className="w-12 flex flex-col space-y-4">
            <button
              className=" relative group/btn  flex space-x-2 items-center justify-start px-4 w-auto text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="submit">
              <IconBrandGoogle className="h-8 w-8 text-neutral-800 dark:text-neutral-300" />
              {/* <BottomGradient /> */}
            </button>
          </div>
          <div className="flex items-center justify-center h-[100%]">
            <p> Already have an account? 
            <span 
              className="font-bold cursor-pointer text-black-600 hover:underline"
              onClick={() => setIsOpen(true)}>
            Login
            </span>
              </p>
          </div>
        </div>
      </form>
      {isOpen && <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} /> }
     
    </div>)
  );
}

const BottomGradient = () => {
  return (<>
    <span
      className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span
      className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    (<div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>)
  );
};