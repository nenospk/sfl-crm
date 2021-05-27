import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useFirestore } from "./Firestore.js";
import { Formik } from "formik";
import * as Yup from "yup";
import logo from "../img/header_logo.svg";
import { ResponsiveBar } from '@nivo/bar'

import LoadingBar from "../components/LoadingBar";
import SuccessBar from "../components/SuccessBar";
import ErrorBar from "../components/ErrorBar";

import { ResponsiveFunnel } from '@nivo/funnel'

import ReactToPdf from "react-to-pdf";

export default function Account() {
  const { targetList, updateTarget } = useFirestore();
  const ref = React.createRef();
  const [targetSalesUCL, setTargetSalesUCL] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [targetSalesPTK, setTargetSalesPTK] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [targetSalesLKB, setTargetSalesLKB] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [month, setMonth] = useState(["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"])
  const [initialForm, setInitialForm] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(async() => {
    console.log(targetList)
    setInitialForm({
      targetSalesUCL: targetList && targetList.ucl ? targetList.ucl["2021"] : [],
      targetSalesPTK: targetList && targetList.ptk ? targetList.ptk["2021"] : [],
      targetSalesLKB: targetList && targetList.lkb ? targetList.lkb["2021"] : []
    });
  }, [targetList])

  const formValidation = Yup.object().shape({
  });

  function formatted(input) {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      {loading && <LoadingBar />}
      {success && <SuccessBar setSuccess={setSuccess} />}
      {error && <ErrorBar setError={setError} />}
      <div className="header">
        <img src={logo} className="logo" />
      </div>
      <div className="header-greeting">
        <h1>CRM </h1>
        <div>สวัสดี, SPORT FOR LIFE</div>
        <div>ออกจากระบบ</div>
        <div>
          <ul className="selectDuration">
            <li>ตั้งค่า Goal target</li>
            <li>จัดการบัญชีผู้ใช้</li>
            {/*
            <li onClick={()=> {
              setDuration("MONTH");
            }}>THIS MONTH</li>*/}
          </ul>
        </div>
      </div>

      <div className="my-container">
        <div>
          <h2>ตั้งค่า Goal target</h2>
        <Formik
          enableReinitialize
          initialValues={{ ...initialForm }}
          validationSchema={formValidation}
          validateOnChange={false}
          validateOnBlur={false}
          
          onSubmit={async (values, { setSubmitting,resetForm }) => {
            console.log(values);
            setSuccess()
            setSubmitting(true);
            setLoading(true);
            setSubmitting(false);
            setLoading(false);
            setTargetSalesUCL(values.targetSalesUCL.map(v => v === undefined ? 0 : v))
            setTargetSalesLKB(values.targetSalesLKB.map(v => v === undefined ? 0 : v))
            setTargetSalesPTK(values.targetSalesPTK.map(v => v === undefined ? 0 : v))
            let goal = {
              ucl: values.targetSalesUCL.map(v => v === undefined ? 0 : v),
              lkb: values.targetSalesLKB.map(v => v === undefined ? 0 : v),
              ptk: values.targetSalesPTK.map(v => v === undefined ? 0 : v)
            }
            updateTarget("2021", goal)
            setSuccess("บันทึกข้อมูลสำเร็จ")
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
              <div>
                <div className="content">
                  {success && (
                  <div className="success">
                    {success}
                  </div>
                  )}
                  <label className="formError">
                    {errors.myref && errors.myref}
                  </label>

                  <table className="targetSetting">
                    <tr>
                      <th>#</th>
                      <th>สาขา</th>
                      <th>2021</th>
                      {month.map((value, index) => {
                        return <th key={index}>{value}</th>
                      })}
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>UCL</td>
                      <td>{
                        values.targetSalesUCL ? values.targetSalesUCL.reduce((a, b) => a + (parseInt(b) || 0), 0) : 0
                      }</td>
                      {month.map((value, index) => {
                        return (
                          <td>
                            <input
                              type="number"
                              placeholder="Target"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`targetSalesUCL.${index}`}
                              value={values.targetSalesUCL && typeof values.targetSalesUCL[index] !== 'undefined' && values.targetSalesUCL[index] || ""}
                              key={index}
                            />
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>LKB</td>
                      <td>{
                        values.targetSalesLKB ? values.targetSalesLKB.reduce((a, b) => a + (parseInt(b) || 0), 0) : 0
                      }</td>
                      {month.map((value, index) => {
                        return (
                          <td>
                            <input
                              type="number"
                              placeholder="Target"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`targetSalesLKB.${index}`}
                              value={values.targetSalesLKB && typeof values.targetSalesLKB[index] !== 'undefined' && values.targetSalesLKB[index] || ""}
                              key={index}
                            />
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>PTK</td>
                      <td>{
                        values.targetSalesPTK ? values.targetSalesPTK.reduce((a, b) => a + (parseInt(b) || 0), 0) : 0
                      }</td>
                      {month.map((value, index) => {
                        return (
                          <td>
                            <input
                              type="number"
                              placeholder="Target"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`targetSalesPTK.${index}`}
                              value={values.targetSalesPTK && typeof values.targetSalesPTK[index] !== 'undefined' && values.targetSalesPTK[index] || ""}
                              key={index}
                            />
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Total</td>
                      <td>{
                        parseInt(values.targetSalesUCL ? values.targetSalesUCL.reduce((a, b) => a + (parseInt(b) || 0), 0) : 0) + 
                        parseInt(values.targetSalesLKB ? values.targetSalesLKB.reduce((a, b) => a + (parseInt(b) || 0), 0) : 0) + 
                        parseInt(values.targetSalesPTK ? values.targetSalesPTK.reduce((a, b) => a + (parseInt(b) || 0), 0) : 0)
                      }</td>
                      {month.map((value, index) => {
                        return (
                          <td>
                              {
                              parseInt(values.targetSalesUCL && typeof values.targetSalesUCL[index] !== 'undefined' && values.targetSalesUCL[index] || 0) +
                              parseInt(values.targetSalesLKB && typeof values.targetSalesLKB[index] !== 'undefined' && values.targetSalesLKB[index] || 0) +
                              parseInt(values.targetSalesPTK && typeof values.targetSalesPTK[index] !== 'undefined' && values.targetSalesPTK[index] || 0)
                              }
                          </td>
                        )
                      })}
                    </tr>
                  </table>

              </div>
              </div>
              <div className="actionButton">
                <button
                  className="mainButton"
                  type="submit"
                  disabled={isSubmitting}
                >
                  บันทึก
                </button>
                <button
                  type="reset"
                  className="resetButton"
                  onClick={() => {
                    resetForm();
                  }}
                >
                  ล้างค่า
                </button>
              </div>
            </form>
          )}
        </Formik>

        </div>
        </div>
      <Navbar active={"ออกจากระบบ"} />
    </>
  );

  function Report(props) {
    return (
        <div className={"report"} ref={ref}>
            <h1>Sport for life report</h1>
            <h2>ช่องทาง หน้าร้าน</h2>
            <div><h3>WK13</h3></div>
            
            <input/>
        </div>
    )
  }

}