import React, { FC, ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import NavbarStill from "./navbar.still";
import GoTop from "./go.top";
import { montserrat } from "@/constants/font";

interface LayoutProps {
  children?: ReactNode;
  still?: boolean;
  hideFooter?: boolean;
}

const Layout: FC<LayoutProps> = (props) => {
  return (
    <>
      {props.still ? <NavbarStill /> : <Navbar />}
      <div className={montserrat.className}>{props.children}</div>
      {!props.hideFooter && <Footer />}
      <GoTop />
    </>
  );
};

export default Layout;
