import React, { FC, ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import NavbarStill from "./navbar.still";
import GoTop from "./go.top";
import Head from "next/head";
import { montserrat } from "@/constants/font";

interface LayoutProps {
  children?: ReactNode;
  still?: boolean;
  pageTitle?: string;
  hideFooter?: boolean;
}

const Layout: FC<LayoutProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.pageTitle ?? ""}</title>
        <meta
          name="description"
          content="Discover our reliable transportation tours for exploring top destinations. Book private or group tours with comfort, convenience, and expert local guides. Your journey starts here!"
        />
      </Head>
      {props.still ? <NavbarStill /> : <Navbar />}
      <div className={montserrat.className}>{props.children}</div>
      {!props.hideFooter && <Footer />}
      <GoTop />
    </>
  );
};

export default Layout;
