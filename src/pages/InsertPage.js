import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { useFirestore } from "./Firestore.js";
import logo from "../img/header_logo.svg";

import stage_customer from "../img/stage_customer.svg";
import stage_expansion from "../img/stage_expansion.svg";
import stage_lead from "../img/stage_lead.svg";

import channel_offline from "../img/channel_offline.svg";
import channel_online from "../img/channel_online.svg";

import LoadingBar from "../components/LoadingBar";
import SuccessBar from "../components/SuccessBar";
import ErrorBar from "../components/ErrorBar";

export default function InsertPage() {
  const { addCustomer } = useFirestore();
  const [currentCustomer, setCurrentCustomer] = useState();
  const [currentStage, setCurrentStage] = useState();
  const [currentSearch, setCurrentSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [initialForm, setInitialForm] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([
    { name: "พระรามสี่", sale: ["เนส", "ชมพู่", "จีน่า", "นิด", "นนท์"] },
    { name: "พัฒนาการ", sale: ["สิท", "ตอง", "เบ๊บ", "เบญ", "วิคเตอร์"] },
    { name: "ลาดกระบัง", sale: ["ตูน", "ส้ม", "โจ้", "โป๊บ"] }
  ]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [otherReason, setOtherReason] = useState(false);

  useEffect(async () => {
    //console.log("CURRENT CUSTOMER", currentCustomer);
    //console.log("CURRENT SEARCH", currentSearch);
    if (currentCustomer && currentCustomer.phone != currentSearch) {
      setCurrentCustomer();
      setInitialForm({
        myref: "",
        sale_person: "",
        sale_branch: "",
        phone: "",
        name: "",
        stage: "Lead",
        channel: "offline",
        lead_reason: "",
        lead_otherReason: "",
        lead_sales: "",
        customer_so: "",
        customer_sales: "",
        customer_category: []
      });
    } else {
      setInitialForm({
        myref:
          currentCustomer && currentCustomer.myref != undefined
            ? currentCustomer.myref
            : "",
        sale_person: "",
        sale_branch: "",
        phone: currentSearch && currentSearch != undefined ? currentSearch : "",
        name:
          currentCustomer && currentCustomer.name != undefined
            ? currentCustomer.name
            : "",
        stage:
          currentStage && currentStage != undefined ? currentStage : "Lead",
        channel:
          currentCustomer && currentCustomer.channel != undefined
            ? currentCustomer.channel
            : "offline",
        lead_reason:
          currentCustomer && currentCustomer.lead_reason != undefined
            ? currentCustomer.lead_reason
            : "",
        lead_otherReason:
          currentCustomer && currentCustomer.lead_otherReason != undefined
            ? currentCustomer.lead_otherReason
            : "",
        lead_sales:
          currentCustomer && currentCustomer.lead_sales != undefined
            ? currentCustomer.lead_sales
            : "",
        customer_so: "",
        customer_sales: "",
        customer_category: []
      });
    }
  }, [currentCustomer, currentSearch, currentStage]);

  function numberWithCommas(num) {
    if (num) {
      var num_parts = num
        .toString()
        .replace(/,/g, "")
        .split(".");
      num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return num_parts.join(".");
    } else return "";
  }

  const formValidation = Yup.object().shape({
    phone: Yup.string()
      .required("*กรุณากรอก")
      .min(10, "*กรุณากรอก 10 หลัก")
      .max(11, "*กรุณากรอก 10 หลัก"),
    name: Yup.string()
      .required("*กรุณากรอก")
      .matches(/(?!^\d+$)^.+$/, "*ห้ามเป็นตัวเลขอย่างเดียว"),
    stage: Yup.string().required("*กรุณากรอก"),
    channel: Yup.string().required("*กรุณากรอก"),
    sale_person: Yup.string().required("*กรุณากรอก"),
    sale_branch: Yup.string().required("*กรุณากรอก"),
    lead_reason: Yup.string().when("stage", {
      is: value => value == "Lead",
      then: Yup.string().required("*กรุณากรอก")
    }),
    lead_otherReason: Yup.string().when("lead_reason", {
      is: value => value == "อื่นๆ",
      then: Yup.string().required("*กรุณากรอก")
    }),
    lead_sales: Yup.string().when("stage", {
      is: value => value == "Lead",
      then: Yup.string().required("*กรุณากรอก")
    }),
    customer_sales: Yup.string().when("stage", {
      is: value => value == "Customer" || value == "Expansion",
      then: Yup.string().required("*กรุณากรอก")
    }),
    customer_so: Yup.string().when("stage", {
      is: value => value == "Customer" || value == "Expansion",
      then: Yup.string().required("*กรุณากรอก")
    })
  });

  return (
    <>
      {loading && <LoadingBar />}
      {success && <SuccessBar setSuccess={setSuccess} />}
      {error && <ErrorBar setError={setError} />}
      <div className="header">
        <img src={logo} className="logo" />
      </div>

      <div className="holder">
        <div className="notice-box">
          <label className="success">{success}</label>
          <label className="error">{error}</label>
        </div>
        <Formik
          enableReinitialize
          initialValues={{ ...initialForm }}
          validationSchema={formValidation}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(true);
            setLoading(true);
            const result = await addCustomer(values, currentCustomer);
            console.log(result);
            setSubmitting(false);
            setLoading(false);
            if (result.status == "success") {
              setSuccess(true);
              setError(false);
              currentSearch();
              setCurrentStage();
              setCurrentCustomer();
              resetForm();
            } else {
              setSuccess(false);
              setError(true);
            }
            return;
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            resetForm
          }) => (
            <form onSubmit={handleSubmit} className="insert-form">
              <div className="form-header">
                <h1>CRM </h1>
                <div>สวัสดี, SPORT FOR LIFE</div>
              </div>
              <div>
                <div className="content">
                  <label className="formError">
                    {errors.myref && errors.myref}
                  </label>
                  <input
                    type="hidden"
                    name="myref"
                    placeholder="รหัสลูกค้า"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.myref || ""}
                  />
                </div>
                <label className="formError">
                  {errors.phone && errors.phone}
                </label>
                <Auto
                  setCurrentCustomer={setCurrentCustomer}
                  setCurrentSearch={setCurrentSearch}
                  setCurrentStage={setCurrentStage}
                  phoneSearch={phoneSearch}
                  setPhoneSearch={setPhoneSearch}
                />
                <div className="content">
                  <label className="formError">
                    {errors.name && errors.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="ชื่อ"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name || ""}
                  />
                </div>
              </div>
              <label className="formError">
                {errors.stage && errors.stage}
              </label>
              <div className="radio-tile-group">
                <div className="input-container">
                  <input
                    className={
                      (currentStage &&
                        currentStage == "Customer" &&
                        values.stage == "Customer") ||
                      (currentStage &&
                        currentStage == "Expansion" &&
                        values.stage == "Expansion")
                        ? "radio-button disabled"
                        : "radio-button"
                    }
                    type="radio"
                    name="stage"
                    value="Lead"
                    checked={
                      values.stage === "Lead" || values.stage == undefined
                    }
                    onChange={() => setFieldValue("stage", "Lead")}
                    disabled={
                      (currentStage &&
                        currentStage == "Customer" &&
                        values.stage == "Customer") ||
                      (currentStage &&
                        currentStage == "Expansion" &&
                        values.stage == "Expansion")
                        ? "disabled"
                        : null
                    }
                  />
                  <div className="radio-tile">
                    <img src={stage_lead} />
                    Lead
                  </div>
                </div>
                <div className="input-container">
                  <input
                    className={
                      currentStage &&
                      currentStage == "Expansion" &&
                      values.stage == "Expansion"
                        ? "radio-button disabled"
                        : "radio-button"
                    }
                    type="radio"
                    name="stage"
                    value="Customer"
                    checked={values.stage === "Customer"}
                    onChange={() => setFieldValue("stage", "Customer")}
                    disabled={
                      currentStage &&
                      currentStage == "Expansion" &&
                      values.stage == "Expansion"
                        ? "disabled"
                        : null
                    }
                  />
                  <div className="radio-tile">
                    <img src={stage_customer} />
                    Customer
                  </div>
                </div>
                <div className="input-container">
                  <input
                    className={
                      currentStage &&
                      currentStage == "Lead" &&
                      values.stage == "Lead"
                        ? "radio-button disabled"
                        : "radio-button"
                    }
                    type="radio"
                    name="stage"
                    value="Expansion"
                    checked={values.stage === "Expansion"}
                    onChange={() => setFieldValue("stage", "Expansion")}
                    disabled={
                      currentStage &&
                      currentStage == "Lead" &&
                      values.stage == "Lead"
                        ? "disabled"
                        : null
                    }
                  />
                  <div className="radio-tile">
                    <img src={stage_expansion} />
                    Expansion
                  </div>
                </div>
              </div>
              {values.stage == "Lead" || values.stage == undefined ? (
                <div>
                  <label className="formError">
                    {errors.lead_reason && errors.lead_reason}
                  </label>
                  <select
                    name="lead_reason"
                    value={values.lead_reason}
                    onChange={e => {
                      handleChange(e);
                      if (e.currentTarget.value === "อื่นๆ")
                        setOtherReason(true);
                      else setOtherReason(false);
                    }}
                    onBlur={handleBlur}
                    style={{ display: "block" }}
                  >
                    <option value="" label="เหตุผล" key={"1"}>
                      เหตุผล
                    </option>
                    <option value="ซื้อ" label="ซื้อ" key={"2"}>
                      ซื้อ
                    </option>
                    <option value="สอบถาม" label="สอบถาม" key={"3"}>
                      สอบถาม
                    </option>
                    <option value="ไม่เคยนำเข้า" label="ไม่เคยนำเข้า" key={"4"}>
                      ไม่เคยนำเข้า
                    </option>
                    <option value="สินค้าหมด" label="สินค้าหมด" key={"5"}>
                      สินค้าหมด
                    </option>
                    <option value="อื่นๆ" label="อื่นๆ" key={"6"}>
                      อื่นๆ
                    </option>
                  </select>
                  {otherReason && (
                    <div className="content">
                      <label className="formError">
                        {errors.lead_otherReason && errors.lead_otherReason}
                      </label>
                      <input
                        type="text"
                        name="lead_otherReason"
                        placeholder="เหตุผลอื่นๆ"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lead_otherReason || ""}
                      />
                    </div>
                  )}
                  <label className="formError">
                    {errors.lead_sales && errors.lead_sales}
                  </label>
                  <select
                    name="lead_sales"
                    value={values.lead_sales}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ display: "block" }}
                  >
                    <option value="" label="ยอดซื้อ" key={"1"}>
                      ยอดซื้อ
                    </option>
                    <option value="1-10,000 บาท" label="1-10,000 บาท" key={"2"}>
                      1-10,000 บาท
                    </option>
                    <option
                      value="10,001-50,000 บาท"
                      label="10,001-50,000 บาท"
                      key={"3"}
                    >
                      10,001-50,000 บาท
                    </option>
                    <option
                      value="50,001-100,000 บาท"
                      label="50,001-100,000 บาท"
                      key={"4"}
                    >
                      50,001-100,000 บาท
                    </option>
                    <option
                      value="100,001-300,000 บาท"
                      label="100,001-300,000 บาท"
                      key={"5"}
                    >
                      100,001-300,000 บาท
                    </option>
                    <option
                      value="300,001-500,000 บาท"
                      label="300,001-500,000 บาท"
                      key={"6"}
                    >
                      300,001-500,000 บาท
                    </option>
                    <option
                      value="มากกว่า 500,000 บาท"
                      label="มากกว่า 500,000 บาท"
                      key={"7"}
                    >
                      มากกว่า 500,000 บาท
                    </option>
                  </select>
                </div>
              ) : (
                ""
              )}
              {values.stage == "Customer" || values.stage == "Expansion" ? (
                <div>
                  <label className="formError">
                    {errors.customer_so && errors.customer_so}
                  </label>
                  <div className="content">
                    <label>
                      <label className="formError" />
                    </label>
                    <input
                      type="text"
                      name="customer_so"
                      placeholder="หมายเลข Receipt"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.customer_so}
                    />
                  </div>
                  <label className="formError">
                    {errors.customer_sales && errors.customer_sales}
                  </label>
                  <div className="content">
                    <label>
                      <label className="formError" />
                    </label>
                    <input
                      type="text"
                      name="customer_sales"
                      placeholder="ยอดซื้อ"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={numberWithCommas(values.customer_sales)}
                    />
                  </div>
                  <label className="formError">
                    {errors.customer_category && errors.customer_category}
                  </label>
                  <div className="checkbox-tile-group">
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="จักรยาน"
                      />
                      <div className="checkbox-tile">จักรยาน</div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="เฟรมจักรยาน"
                      />
                      <div className="checkbox-tile">เฟรมจักรยาน</div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="ส่วนประกอบ"
                      />
                      <div className="checkbox-tile">ส่วนประกอบ</div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="เครื่องแต่งกาย"
                      />
                      <div className="checkbox-tile">เครื่องแต่งกาย</div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="อุปกรณ์ตกแต่ง"
                      />
                      <div className="checkbox-tile">อุปกรณ์ตกแต่ง </div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="สมาร์ทวอทช์"
                      />
                      <div className="checkbox-tile">สมาร์ทวอทช์</div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="บริการ"
                      />
                      <div className="checkbox-tile">บริการ</div>
                    </div>
                    <div className="input-checkbox-container">
                      <Field
                        type="checkbox"
                        className="checkbox-button"
                        name="customer_category"
                        value="อื่นๆ"
                      />
                      <div className="checkbox-tile">อื่นๆ</div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <label className="formError">
                {errors.sale_branch && errors.sale_branch}
              </label>
              <select
                name="sale_branch"
                value={values.sale_branch || ""}
                onChange={e => {
                  handleChange(e);
                  setSelectedBranch(
                    branches.find(x => x.name === e.currentTarget.value)
                  );
                }}
                onBlur={handleBlur}
                style={{ display: "block" }}
              >
                <option value="" label="สาขา">
                  สาขา
                </option>
                {branches &&
                  branches.map((branch, index) => (
                    <option value={branch.name} label={branch.name} key={index}>
                      {branch.name}
                    </option>
                  ))}
              </select>
              <label className="formError">
                {errors.sale_person && errors.sale_person}
              </label>
              {selectedBranch && (
                <select
                  name="sale_person"
                  value={values.sale_person || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ display: "block" }}
                >
                  <option value="" label="ชื่อเซล">
                    ชื่อเซล
                  </option>
                  {selectedBranch &&
                    selectedBranch.sale.map((sale, index) => (
                      <option value={sale} label={sale} key={index}>
                        {sale}
                      </option>
                    ))}
                </select>
              )}
              <label className="formError">
                {errors.channel && errors.channel}
              </label>
              <div className="radio-tile-group">
                <div className="input-container-channel">
                  <input
                    className="radio-button"
                    type="radio"
                    name="channel"
                    value="offline"
                    checked={
                      values.channel === "offline" ||
                      values.channel == undefined
                    }
                    onChange={() => setFieldValue("channel", "offline")}
                  />
                  <div className="radio-tile">
                    <img src={channel_offline} />
                    Offline
                  </div>
                </div>
                <div className="input-container-channel">
                  <input
                    className="radio-button"
                    type="radio"
                    name="channel"
                    value="online"
                    checked={values.channel === "online"}
                    onChange={() => setFieldValue("channel", "online")}
                  />
                  <div className="radio-tile">
                    <img src={channel_online} />
                    Online
                  </div>
                </div>
              </div>
              <div className="actionButton">
                <button
                  className="mainButton"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {currentCustomer ? "อัพเดท" : "เพิ่ม"}
                </button>
                <button
                  type="reset"
                  className="resetButton"
                  onClick={() => {
                    setCurrentCustomer();
                    setPhoneSearch("");
                    setCurrentStage();
                    resetForm;
                  }}
                >
                  ล้างค่า
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <Navbar active={"กรอกข้อมูล"} />
    </>
  );
}

const Auto = props => {
  const { customerList } = useFirestore();
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState();

  useEffect(async () => {
    setOptions(customerList);
  }, [customerList]);

  useEffect(async () => {
    //console.log(props.phoneSearch);
    let result = objectSearch(props.phoneSearch, options);
    if (result != -1) {
      props.setCurrentSearch(result.phone);
      props.setCurrentCustomer(result);
    } else {
      props.setCurrentStage();
    }
  }, [props.phoneSearch]);

  function objectSearch(nameKey, myArray) {
    if (nameKey.length == 0 || myArray.length == 0) return -1;
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].phone === nameKey) {
        return myArray[i];
      }
    }
    return -1;
  }

  const selectAuto = option => {
    props.setPhoneSearch(option.phone);
    props.setCurrentSearch(option.phone);
    props.setCurrentCustomer(option);
    switch (option.stage) {
      case "Lead":
        props.setCurrentStage("Customer");
        break;
      case "Customer":
        props.setCurrentStage("Expansion");
        break;
      case "Expansion":
        props.setCurrentStage("Expansion");
        break;
      default:
        props.setCurrentStage("Lead");
    }
    setDisplay(false);
  };

  return (
    <div className="autocomplete-holder">
      <input
        onBlur={props.handleBlur}
        onClick={() => {
          setDisplay(!display);
        }}
        value={props.phoneSearch}
        onChange={event => {
          props.handleChange;
          props.setCurrentSearch(event.target.value);
          if (event.target.value != "") setDisplay(true);
          else setDisplay(false);
          props.setPhoneSearch(event.target.value);
        }}
        placeholder="เบอร์โทรศัพท์"
      />
      <div className={"autocomplete"}>
        {display &&
          options
            .filter(
              option =>
                option.phone &&
                option.phone
                  .toLowerCase()
                  .indexOf(props.phoneSearch.toLowerCase()) > -1
            )
            .slice(0, 5)
            .map((option, index) => {
              return (
                <div
                  className={"autocomplete-item"}
                  key={index}
                  onClick={() => {
                    selectAuto(option);
                  }}
                >
                  <div className="phone">{option.phone}</div>
                  <div className="minor">
                    {option.name} - {option.stage}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
