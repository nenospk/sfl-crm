import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useFirestore } from "./Firestore.js";
import { Formik } from "formik";
import * as Yup from "yup";
import logo from "../img/header_logo.svg";
import moment from "moment";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";

export default function ViewPage() {
  const { customerList } = useFirestore();
  const [currentCustomer, setCurrentCustomer] = useState();
  const [currentSearch, setCurrentSearch] = useState("");
  const [initialForm, setInitialForm] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="header">
        <img src={logo} className="logo" />
      </div>
      <div className="header-greeting">
        <h1>CRM </h1>
        <div>สวัสดี, SPORT FOR LIFE</div>
      </div>

      <div>
        <DateRangePicker />
      </div>

      <div className={"responsive"}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อลูกค้า</th>
              <th>โทรศัพท์</th>
              <th>สถานะ</th>
              <th>ยอดคาดหวัง</th>
              <th>สาขา</th>
              <th>Sale</th>
              <th>เพิ่มเมื่อ</th>
              <th>อัพเดทล่าสุด</th>
              <th>ลบ</th>
              <th>แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {customerList &&
              customerList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name && item.name}</td>
                  <td>{item.phone && item.phone}</td>
                  <td>{item.stage && item.stage}</td>
                  <td>{item.lead_sales && item.lead_sales}</td>
                  <td>{item.sale_branch && item.sale_branch}</td>
                  <td>{item.sale_person && item.sale_person}</td>
                  <td>
                    {item.dt &&
                      moment.unix(item.dt).format("MM/DD/YYYY HH:mm:ss")}
                  </td>
                  <td>
                    {item.dt_lastupdate &&
                      moment
                        .unix(item.dt_lastupdate)
                        .format("MM/DD/YYYY HH:mm:ss")}
                  </td>
                  <td>
                    <a>ลบ</a>
                  </td>
                  <td>
                    <a>แก้ไข</a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Navbar active={"ดูข้อมูล"} />
    </>
  );
}
