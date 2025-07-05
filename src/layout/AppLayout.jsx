import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

function AppLayout() {
  return (
    <>
      <NavBar />
      <Outlet />,
      <Footer/>
    </>
  );
}

export default AppLayout;
