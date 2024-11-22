'use client';

import { FaGoogle, FaDiscord, FaGithub, FaReddit } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  return (
    <div className="bg-gray-800 rounded-md shadow-brutal-sm shadow-gray-600 p-4">
      <p>Sign in with one of the following methods:</p>
      <div className="flex justify-between mt-2">
        <button
          className="bg-black flex justify-center p-2 rounded text-2xl"
          onClick={() => signIn("google")}
        >
          <FaGoogle />
        </button>
        {/* <button
            className="bg-black flex justify-center py-2 rounded text-2xl"
            onClick={() => signIn("facebook")}
          >
            <FaFacebook />
          </button> */}
        <button
          className="bg-black flex justify-center p-2 rounded text-2xl"
          onClick={() => signIn("discord")}
        >
          <FaDiscord />
        </button>
        <button
          className="bg-black flex justify-center p-2 rounded text-2xl"
          onClick={() => signIn("github")}
        >
          <FaGithub />
        </button>
        <button
          className="bg-black flex justify-center p-2 rounded text-2xl"
          onClick={() => signIn("reddit")}
        >
          <FaReddit />
        </button>
        {/* <button
            className="bg-black flex justify-center p-2 rounded text-2xl"
            onClick={() => signIn("nodemailer")}
          >
            <SiMaildotru />
          </button> */}
      </div>
      {/* <form
          action={async (formData) => {
            "use server";
            await authSignIn("nodemailer", formData);
          }}
          className="flex"
        >
          <input
            className="bg-gray-700 text-white rounded-md p-2 mt-4 w-full"
            name="email"
            placeholder="Email"
            type="text"
          />
          <button
            className="bg-black text-white rounded-md p-2 mt-4 ml-2"
            type="submit"
          >
            Sign Up
          </button>
        </form> */}
    </div>
  );
}
