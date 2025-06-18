import React from "react";

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="xl:p-5 p-4 bg-gray-100 flex items-center w-full h-screen gap-x-5">
      <div
        style={{
          backgroundImage: `url("/sidepanel.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "contain",
        }}
        className="bg-purple-300 hidden h-full w-[41.67%] p-10 lg:flex flex-col justify-between"
      >
        <h1 className="text-preset-1 text-secondary-yellow">CNAFF</h1>
        <div className="space-y-6">
          <h2 className="text-preset-2 text-white">
            Automate the creation of official memo and meeting letters -
            securely, accurately and in seconds
          </h2>
          <h3 className="text-preset-4 text-white">
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
