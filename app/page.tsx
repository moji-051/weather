'use client'

import { useState } from "react";
import Weather from "./components/weather";
import backgroundLight from "./assets/backgroundLight.jpg";
import backgroundDark from "./assets/backgroundDark.jpg";

export default function Home() {
  const [dark,setDark] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-2 h-screen justify-center items-center" 
    style={{
        backgroundImage: `url(${dark ? backgroundDark.src : backgroundLight.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <button
        onClick={() => setDark(!dark)}
        className={`w-77 p-3 font-semibold rounded-3xl text-white ${
          dark ? "bg-zinc-800" : "bg-emerald-800"
        }`}
      >
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
      <div className={`rounded-3xl backdrop-blur-sm ${
        dark ? "bg-zinc-900 text-white" : ""
      }`}>
        <Weather dark={dark}/>
      </div>
    </div>
  );
}
