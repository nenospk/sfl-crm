import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { useFirestore } from "./Firestore.js";

const Auto = props => {
  const { customerList, addCustomer } = useFirestore();
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState();

  useEffect(async () => {
    setOptions(customerList);
  }, [customerList]);

  const selectAuto = option => {
    setSearch(option.name);
    props.setCurrentCustomer(option);
    setDisplay(false);
  };

  return (
    <div>
      <input
        id="auto"
        onClick={() => {
          setDisplay(!display);
        }}
        value={search}
        onChange={event => {
          setSearch(event.target.value);
        }}
        placeholder="type to search"
      />
      <div className={"autocomplete"}>
        {display &&
          options
            .filter(
              option =>
                option.name.toLowerCase().indexOf(search.toLowerCase()) > -1
            )
            .map((option, index) => {
              return (
                <div
                  className={"autocomplete-item"}
                  key={index}
                  onClick={() => {
                    selectAuto(option);
                  }}
                >
                  <div>{option.phone}</div>
                  <div>
                    {option.name} - {option.stage}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default function InsertPage() {
  const [currentCustomer, setCurrentCustomer] = useState();
  const [initialForm, setInitialForm] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  const formValidation = Yup.object().shape({
    //branchName: Yup.string().required("*กรุณากรอก"),
    //branchCode: Yup.string().required("*กรุณากรอก")
  });

  useEffect(async () => {
    //console.log(currentCustomer);
    setInitialForm({
      myref: currentCustomer ? currentCustomer.myref : "",
      phone: currentCustomer ? currentCustomer.phone : "",
      name: currentCustomer ? currentCustomer.name : "",
      stage: currentCustomer ? currentCustomer.stage : "Lead",
      lead_reason: currentCustomer ? currentCustomer.lead_reason : "",
      lead_sales: currentCustomer ? currentCustomer.lead_sales : "",
      customer_sales: "",
      customer_category: []
    });
  }, [currentCustomer]);

  return (
    <>
      <div className="header">
        <h1>CRM </h1>
        <div>สวัสดีคุณ นิ้ง , SFL สาขาลาดกระบัง</div>
      </div>
      <div className="notice-box">
        <label className="success">{success}</label>
        <label className="error">{error}</label>
      </div>
      <Formik
        enableReinitialize
        initialValues={{ ...initialForm }}
        validationSchema={formValidation}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          console.log(values);
          setSubmitting(true);
          setLoading(true);
          try {
            const result = await addCustomer(values, currentCustomer);
            console.log(result);
            setSubmitting(false);
            setLoading(false);
            if (result.status == "success") {
              setSuccess(result.message);
              setError();
              resetForm({});
            } else {
              setSuccess();
              setError(result.message);
            }
          } catch {
            setSubmitting(false);
            setLoading(false);
            //setSuccess();
            //setError("เกิดข้อผิดพลาด");
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
          <form onSubmit={handleSubmit}>
            <div className="flex-container">
              <Auto setCurrentCustomer={setCurrentCustomer} />
              <div className="content">
                <label>
                  <label className="formError">
                    {errors.myref && touched.myref && errors.myref}
                  </label>
                </label>
                <input
                  type="text"
                  name="myref"
                  placeholder="รหัสลูกค้า"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.myref}
                />
              </div>
              <div className="content">
                <label>
                  <label className="formError">
                    {errors.phone && touched.phone && errors.phone}
                  </label>
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="เบอร์โทรศัพท์"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />
              </div>
              <div className="content">
                <label>
                  <label className="formError">
                    {errors.name && touched.name && errors.name}
                  </label>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="ชื่อ"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>
            </div>
            <label>
              <input
                type="radio"
                name="stage"
                value="Lead"
                checked={values.stage === "Lead"}
                onChange={() => setFieldValue("stage", "Lead")}
              />
              Lead
            </label>
            <label>
              <input
                type="radio"
                name="stage"
                value="Customer"
                checked={values.stage === "Customer"}
                onChange={() => setFieldValue("stage", "Customer")}
              />
              Customer
            </label>
            <label>
              <input
                type="radio"
                name="stage"
                value="Expansion"
                checked={values.stage === "Expansion"}
                onChange={() => setFieldValue("stage", "Expansion")}
              />
              Expansion
            </label>
            {values.stage == "Lead" ? (
              <div>
                <select
                  name="lead_reason"
                  value={values.lead_reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ display: "block" }}
                >
                  <option value="" label="เหตุผล" />
                  <option value="เหตุผล1" label="เหตุผล1" />
                  <option value="เหตุผล2" label="เหตุผล2" />
                  <option value="เหตุผล3" label="เหตุผล3" />
                </select>
                <select
                  name="lead_sales"
                  value={values.lead_sales}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ display: "block" }}
                >
                  <option value="" label="ยอดซื้อ" />
                  <option value="0-10,000" label="0-10,000" />
                  <option value="10,001-50,000" label="10,001-50,000" />
                  <option value="50,001-100,000" label="50,001-100,000" />
                </select>
              </div>
            ) : (
              ""
            )}
            {values.stage == "Customer" || values.stage == "Expansion" ? (
              <div>
                <div className="content">
                  <label>
                    <label className="formError">
                      {errors.customer_sales &&
                        touched.customer_sales &&
                        errors.customer_sales}
                    </label>
                  </label>
                  <input
                    type="text"
                    name="customer_sales"
                    placeholder="ยอดซื้อ"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customer_sales}
                  />
                </div>
                <div role="group" aria-labelledby="checkbox-group">
                  <label>
                    <Field
                      type="checkbox"
                      name="customer_category"
                      value="One"
                    />
                    One
                  </label>
                  <label>
                    <Field
                      type="checkbox"
                      name="customer_category"
                      value="Two"
                    />
                    Two
                  </label>
                  <label>
                    <Field
                      type="checkbox"
                      name="customer_category"
                      value="Three"
                    />
                    Three
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}
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
                  resetForm;
                  setCurrentCustomer();
                }}
              >
                ล้างค่า
              </button>
            </div>
          </form>
        )}
      </Formik>
      <Navbar />
    </>
  );
}
