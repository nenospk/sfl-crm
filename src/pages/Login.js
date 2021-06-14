import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useFirestore } from "./Firestore.js";
import { Formik } from "formik";
import * as Yup from "yup";
import logo from "../img/header_logo.svg";
import moment from "moment";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

export default function Login() {
  return (
    <>
      <div className="header">
        <img src={logo} className="logo" />
      </div>
      <div className="header-greeting">
        <h1>CRM </h1>
        <div>สวัสดี, SPORT FOR LIFE</div>
      </div>
      <Navbar active={"ดูข้อมูล"} />
    </>
  );
}
