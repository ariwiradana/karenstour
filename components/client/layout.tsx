import React, { FC, ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import NavbarStill from "./navbar.still";
import GoTop from "./go.top";
import Head from "next/head";

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
      </Head>
      {props.still ? <NavbarStill /> : <Navbar />}
      {props.children}
      {!props.hideFooter && <Footer />}
      <GoTop />
    </>
  );
};

export default Layout;
