import Image from "next/image";
import React from "react";

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="xl:p-5 p-4 flex items-center w-full h-screen gap-x-5 bg-blue-200">
      <div
        style={{
          backgroundImage: `url("/aside-pic.webp")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "contain",
        }}
        className="hidden h-full w-[41.67%] p-10 lg:flex flex-col justify-between bg-gradient-to-t from-5% to-95% from-blue-200 to-blue-500"
      >
        <div className="flex p-1 w-min items-center gap-x-2">
          <Image
            src="/Ellipse.png"
            alt="CNFF"
            height="70"
            width="70"
            className="aspect-square w-auto h-auto min-w-[4rem] rounded-md"
          />
          <div className="flex flex-col">
            <h1 className="text-preset-2 text-blue-500">CNAFF</h1>
            <p className="text-preset-4-bold text-nowrap">Global Resources</p>
          </div>
        </div>
        <div className="space-y-6 mt-auto">
          <h2 className="text-preset-2 text-blue-300">
            Automate the creation of official memo and meeting letters -
            securely, accurately and in seconds
          </h2>
          <h3 className="text-preset-4 text-blue-300">
            The master template stay safe on our system - only approved data is
            inserted for each letter
          </h3>
        </div>
      </div>
      <div className="h-full w-full lg:w-[58.33%]">{children}</div>
    </main>
  );
};

export default DashboardProvider;
