import React, { FC, ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import { montserrat } from "@/constants/font";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: FC<LayoutProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className={`flex w-full min-h-screen ${montserrat.className}`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`${
          isCollapsed ? "ml-16 md:ml-20 lg:ml-16" : "ml-16 md:ml-60 lg:ml-72"
        } flex-1 p-6 md:p-6 lg:p-10 transition-all duration-300 bg-white text-black w-full overflow-x-hidden`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
