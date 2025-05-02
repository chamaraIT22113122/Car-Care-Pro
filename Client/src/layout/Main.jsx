import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { pageScrollUp } from "../helper/main";
import ScrollUpButton from "../components/ScrollUp/Scrollup";
import ChatbotIcon from "../components/ChatbotIcon.jsx";

const Main = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    pageScrollUp();
  }, [pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ScrollUpButton />
      <ChatbotIcon />
    </>
  );
};

export default Main;