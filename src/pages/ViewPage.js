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

export default function ViewPage() {
  const { customerList } = useFirestore();
  const [filterList, setFilterList] = useState();
  const [currentCustomer, setCurrentCustomer] = useState();
  const [currentSearch, setCurrentSearch] = useState("");
  const [initialForm, setInitialForm] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);

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
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={"showDate"}
        >
          เลือกวันที่
        </button>
        <button onClick={() => setFilterList()} className={"resetDate"}>
          ล้างค่า
        </button>
        {/*
        <div style={{ marginLeft: "25px" }}>
          {selectedDate && moment(selectedDate.startDate).format("DD/MM/YYYY")}{" "}
          - {selectedDate && moment(selectedDate.endDate).format("DD/MM/YYYY")}
        </div>
        */}
        {showPicker && (
          <div style={{ position: "relative" }}>
            <DateRange
              editableDateInputs={true}
              onChange={item => {
                setSelectedDate([item.selection]);
                //console.log(item.selection);
                let startDate = moment(item.selection.startDate).unix();
                let endDate = moment(item.selection.endDate)
                  .add(1, "days")
                  .unix();

                /*console.log(
                  "start ",
                  moment.unix(startDate).format("DD/MM/YYYY HH:mm:ss")
                );
                console.log(
                  "end ",
                  moment.unix(endDate).format("DD/MM/YYYY HH:mm:ss")
                );
                */
                customerList.map(customer => {
                  //console.log("DATE ", customer.dt);
                });
                setFilterList(
                  customerList.filter(customer => {
                    return startDate <= customer.dt && customer.dt <= endDate;
                  })
                );
              }}
              moveRangeOnFirstSelection={false}
              ranges={selectedDate}
              className={"myPicker"}
            />
          </div>
        )}
      </div>

      <div className={"responsive"}>
        <table>
          <thead>
            <tr>
              <th rowspan="2">#</th>
              <th rowspan="2">ชื่อลูกค้า</th>
              <th rowspan="2">โทรศัพท์</th>
              <th rowspan="2">สถานะ</th>
              <th colspan="4">Lead</th>
              <th colspan="5">Customer</th>
              <th colspan="5">Expansion</th>
              <th rowspan="2">เพิ่มเมื่อ</th>
              <th rowspan="2">อัพเดทล่าสุด</th>
              <th rowspan="2">ลบ</th>
              <th rowspan="2">แก้ไข</th>
            </tr>
            <tr>
              <th>ยอดคาดหวัง</th>
              <th>สาขา</th>
              <th>Sale</th>
              <th>ช่องทาง</th>
              <th>ยอด</th>
              <th>หมวดหมู่</th>
              <th>สาขา</th>
              <th>Sale</th>
              <th>ช่องทาง</th>
              <th>ยอด</th>
              <th>หมวดหมู่</th>
              <th>สาขา</th>
              <th>Sale</th>
              <th>ช่องทาง</th>
            </tr>
          </thead>
          <tbody>
            {filterList
              ? filterList.map((item, index) => (
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
                        moment.unix(item.dt).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td>
                      {item.dt_lastupdate &&
                        moment
                          .unix(item.dt_lastupdate)
                          .format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td>
                      <a>ลบ</a>
                    </td>
                    <td>
                      <a>แก้ไข</a>
                    </td>
                  </tr>
                ))
              : customerList &&
                customerList.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name && item.name}</td>
                    <td>{item.phone && item.phone}</td>
                    <td>{item.stage && item.stage}</td>
                    <td>{item.lead_sales && item.lead_sales}</td>
                    <td>{item.sale_branch && item.sale_branch}</td>
                    <td>{item.sale_person && item.sale_person}</td>
                    <td>{item.channel && item.channel}</td>
                    <td>
                      {item.customer_transactions ? (item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index == 0 && <div>{item.customer_sales}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr], "")) : "-"}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index == 0 && (
                                <div>{item.customer_category.join(",")}</div>
                              )
                          )
                          .reduce((prev, curr) => [prev, "", curr], "")}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index == 0 && <div>{item.sale_branch}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr], "")}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index == 0 && <div>{item.sale_person}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr], "")}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index == 0 && <div>{item.channel}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr], "")}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index > 0 && <div>{item.customer_sales}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr])}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index > 0 && (
                                <div>{item.customer_category.join(",")}</div>
                              )
                          )
                          .reduce((prev, curr) => [prev, "", curr])}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index > 0 && <div>{item.sale_branch}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr])}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index > 0 && <div>{item.sale_person}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr])}
                    </td>
                    <td>
                      {item.customer_transactions &&
                        item.customer_transactions.length > 0 &&
                        item.customer_transactions
                          .map(
                            (item, my_index) =>
                              my_index > 0 && <div>{item.channel}</div>
                          )
                          .reduce((prev, curr) => [prev, "", curr])}
                    </td>
                    <td>
                      {item.dt &&
                        moment.unix(item.dt).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td>
                      {item.dt_lastupdate &&
                        moment
                          .unix(item.dt_lastupdate)
                          .format("DD/MM/YYYY HH:mm:ss")}
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
