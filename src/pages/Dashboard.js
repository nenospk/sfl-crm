import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useFirestore } from "./Firestore.js";
import { Formik } from "formik";
import * as Yup from "yup";
import logo from "../img/header_logo.svg";

export default function Dashboard() {
  return (
    <>
      <div className="header">
        <img src={logo} className="logo" />
      </div>
      <div className="header-greeting">
        <h1>CRM </h1>
        <div>สวัสดี, SPORT FOR LIFE</div>
        <div>Dashboard</div>
      </div>
      <Navbar active={"Dashboard"} />
    </>
  );
}
