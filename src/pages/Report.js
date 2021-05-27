import React, { useState, useEffect } from 'react';
import { ResponsiveFunnel } from '@nivo/funnel'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { Line,Doughnut  } from 'react-chartjs-2';
import Navbar from "../components/Navbar";
import logo from "../img/header_logo.svg";
import * as Yup from "yup";
import { Formik } from "formik";

import LoadingBar from "../components/LoadingBar";
import SuccessBar from "../components/SuccessBar";
import ErrorBar from "../components/ErrorBar";

import { PDFExport } from "@progress/kendo-react-pdf";

import { useFirestore } from "./Firestore.js";
import moment from "moment";

import ReactToPdf from "react-to-pdf";

export default function Report() {
  const pdfExportComponent = React.useRef(null);
  const ref = React.createRef();
  const { targetList, customerList, forecastList, reportList, updateForecast, updateReport } = useFirestore();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialForm, setInitialForm] = useState();
  const formValidation = Yup.object().shape({
  });

  useEffect(async() => {
    setInitialForm({
      sales : forecastList !== undefined && forecastList["2021-"+moment().week()].sales,
      customers : forecastList !== undefined && forecastList["2021-"+moment().week()].customers,
      section1: reportList && reportList["2021-22"].section1,
      section2: reportList && reportList["2021-22"].section2,
      section3: reportList && reportList["2021-22"].section3,
      section4: reportList && reportList["2021-22"].section4,
      section5: reportList && reportList["2021-22"].section5,
      section6: reportList && reportList["2021-22"].section6,
      section7: reportList && reportList["2021-22"].section7,
      section8: reportList && reportList["2021-22"].section8,
      section9: reportList && reportList["2021-22"].section9,
      section10: reportList && reportList["2021-22"].section10,
      section11: reportList && reportList["2021-22"].section11,
      section12: reportList && reportList["2021-22"].section12,
      section13: reportList && reportList["2021-22"].section13,
    });
  }, [forecastList, reportList])

  const [weeksInMonth, setWeeksInMonth] = [];
  const [numberOfWeek, setNumberOfWeek] = useState(()=> {
    let weeks = [];
    for(var i = 1; i <= moment().week(); i++){
      weeks.push(i);
    }
    return weeks;
  });
  const [selectedWeek, setSelectedWeek] = useState(moment().week())

  const [branch, setBranch] = useState("ALL");
  const [duration, setDuration] = useState("YEAR");

  const [transactions, setTransactions] = useState([]);

  const [statSales, setStatSales] = useState(0);
  const [statTargetSales, setStatTargetSales] = useState(0);
  const [statLWSales, setStatLWSales] = useState(0);

  const [statLeads, setStatLeads] = useState(0);
  const [statLWLeads, setStatLWLeads] = useState(0);
  const [statCustomers, setStatCustomers] = useState(0);
  const [statLWCustomers, setStatLWCustomers] = useState(0);
  const [statExpansions, setStatExpansions] = useState(0);
  const [statLWExpansions, setStatLWExpansions] = useState(0);
  const [statLosts, setStatLosts] = useState(0);
  const [statLWLosts, setStatLWLosts] = useState(0);

  const [statLeadsUCL, setStatLeadsUCL] = useState(0);
  const [statLeadsPTK, setStatLeadsPTK] = useState(0);
  const [statLeadsLKB, setStatLeadsLKB] = useState(0);
  const [statCustomersUCL, setStatCustomersUCL] = useState(0);
  const [statCustomersPTK, setStatCustomersPTK] = useState(0);
  const [statCustomersLKB, setStatCustomersLKB] = useState(0);
  const [statExpansionsUCL, setStatExpansionsUCL] = useState(0);
  const [statExpansionsPTK, setStatExpansionsPTK] = useState(0);
  const [statExpansionsLKB, setStatExpansionsLKB] = useState(0);

  const [branchPerformance, setBranchPerformace] = useState([]);
  const [periodSales, setPeriodSales] = useState([]);
  const [periodTargetSales, setPeriodTargetSales] = useState([]);
  const [periodUCLSales, setPeriodUCLSales] = useState([]);
  const [periodPTKSales, setPeriodPTKSales] = useState([]);
  const [periodLKBSales, setPeriodLKBSales] = useState([]);

  const [sumUCLSales, setSumUCLSales] = useState(0);
  const [sumPTKSales, setSumPTKSales] = useState(0);
  const [sumLKBSales, setSumLKBSales] = useState(0);

  const [lostsReason, setLostReasons] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  const [topSpender, setTopSpender] = useState([]);

  const [channelUCLOnline, setChannelUCLOnline] = useState(0);
  const [channelUCLOffline, setChannelUCLOffline] = useState(0);
  const [channelPTKOnline, setChannelPTKOnline] = useState(0);
  const [channelPTKOffline, setChannelPTKOffline] = useState(0);
  const [channelLKBOnline, setChannelLKBOnline] = useState(0);
  const [channelLKBOffline, setChannelLKBOffline] = useState(0);

  const [targetSalesUCL, setTargetSalesUCL] = useState([10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]);
  const [targetSalesPTK, setTargetSalesPTK] = useState([10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]);
  const [targetSalesLKB, setTargetSalesLKB] = useState([10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]);

  useEffect(async () => {
    setTargetSalesUCL(targetList && targetList.hasOwnProperty("ucl") ? targetList.ucl["2021"] : [])
    setTargetSalesLKB(targetList && targetList.hasOwnProperty("lkb") ? targetList.lkb["2021"] : [])
    setTargetSalesPTK(targetList && targetList.hasOwnProperty("ptk") ? targetList.ptk["2021"] : [])
  }, [targetList])

  useEffect(async () => {
    let all_transactions = [];

    let _statLeads = 0;
    let _statCustomers = 0;
    let _statExpansions = 0;
    let _statLosts = 0;

    let _statLWLeads = 0;
    let _statLWCustomers = 0;
    let _statLWExpansions = 0;
    let _statLWLosts = 0;

    let _statLeadsUCL = 0;
    let _statLeadsPTK = 0;
    let _statLeadsLKB = 0;

    let _statCustomersUCL = 0;
    let _statCustomersPTK = 0;
    let _statCustomersLKB = 0;

    let _statExpansionsUCL = 0;
    let _statExpansionsPTK = 0;
    let _statExpansionsLKB = 0;

    let _channelUCLOnline = 0;
    let _channelUCLOffline = 0;
    let _channelPTKOnline = 0;
    let _channelPTKOffline = 0;
    let _channelLKBOnline = 0;
    let _channelLKBOffline = 0;

    let _lostsReason = [];
    let _categorySales = [];

    let _topSpender = [];

    let _branchPerformance = [];

    let today = moment();

    if(customerList) {
      _statLeads = customerList.length;
      _statLWLeads = customerList.filter(function (el) {
        return moment.unix(el.dt).week() <= today.week()-1
      }).length;

      _statLWCustomers = customerList.filter(function (el) {
        return moment.unix(el.dt).week() <= today.week()-1 && el.stage == "Customer"
      }).length;

      _statLWExpansions = customerList.filter(function (el) {
        return moment.unix(el.dt).week() <= today.week()-1 && el.stage == "Expansion"
      }).length;

      setStatLWLeads(_statLWLeads - _statLWCustomers);
      setStatLWCustomers(_statLWCustomers + _statLWExpansions);
      setStatLWExpansions(_statLWExpansions);
      setStatLWLosts(0);

      for (let i = 0; i < customerList.length; i++) {
        let customer = customerList[i];

        if(customer.hasOwnProperty('lead_category')) {
          if(customer.lead_category != "") {
            let index = _categorySales.findIndex(x => x.id == customer.lead_category);
            if(index >= 0) _categorySales[index].value+=1
            else _categorySales.push({id: customer.lead_category, label: customer.lead_category, value: 1})
          }
        }
      
        if(customer.hasOwnProperty('lead_reason')) {
          if(customer.lead_reason != "") {
            let index = _lostsReason.findIndex(x => x.id == customer.lead_reason);
            if(index >= 0) _lostsReason[index].value+=1
            else _lostsReason.push({id: customer.lead_reason, label: customer.lead_reason, value: 1})
          }
        }

        if(customer.hasOwnProperty('stage')) {
          if(duration == "YEAR") {
            if(moment.unix(customer.dt).format('YYYY') == today.format('YYYY')) {
              if(customer.sale_branch == "พระรามสี่") {
                _statLeadsUCL += 1;
                if(customer.channel == "online") _channelUCLOnline += 1;
                else if(customer.channel == "offline") _channelUCLOffline += 1;
              }
              else if(customer.sale_branch == "พัฒนาการ") {
                _statLeadsPTK += 1;
                if(customer.channel == "online") _channelPTKOnline += 1;
                else if(customer.channel == "offline") _channelPTKOffline += 1;
              }
              else if(customer.sale_branch == "ลาดกระบัง") {
                _statLeadsLKB += 1;
                if(customer.channel == "online") _channelLKBOnline += 1;
                else if(customer.channel == "offline") _channelLKBOffline += 1;
              }
              if(customer.stage == "Customer") {
                _statCustomers+= 1;
                if(customer.sale_branch == "พระรามสี่") _statCustomersUCL += 1;
                else if(customer.sale_branch == "พัฒนาการ") _statCustomersPTK += 1;
                else if(customer.sale_branch == "ลาดกระบัง") _statCustomersLKB += 1;
              }
              if(customer.stage == "Expansion") {
                _statExpansions += 1;
                if(customer.sale_branch == "พระรามสี่") _statExpansionsUCL += 1;
                else if(customer.sale_branch == "พัฒนาการ") _statExpansionsPTK += 1;
                else if(customer.sale_branch == "ลาดกระบัง") _statExpansionsLKB += 1;
              }
            }
          } else if (duration == "MONTH"){
            if(moment.unix(customer.dt).format('M') == today.format('M')) {
              if(customer.stage == "Customer") _statCustomers+= 1;
              if(customer.stage == "Expansion") _statExpansions += 1;
            }
          }
        }
        _statLosts = _statLeads - _statCustomers;
        setStatLeads(_statLeads);
        setStatCustomers(_statCustomers + _statExpansions);
        setStatExpansions(_statExpansions);
        setStatLosts(_statLosts);

        setStatLeadsUCL(_statLeadsUCL);
        setStatLeadsPTK(_statLeadsPTK);
        setStatLeadsLKB(_statLeadsLKB);

        setStatCustomersUCL(_statCustomersUCL + _statExpansionsUCL);
        setStatCustomersPTK(_statCustomersPTK + _statExpansionsPTK);
        setStatCustomersLKB(_statCustomersLKB + _statExpansionsLKB);

        setStatExpansionsUCL(_statExpansionsUCL);
        setStatExpansionsPTK(_statExpansionsPTK);
        setStatExpansionsLKB(_statExpansionsLKB);

        setChannelUCLOnline(_channelUCLOnline);
        setChannelUCLOffline(_channelUCLOffline);
        setChannelPTKOnline(_channelPTKOnline);
        setChannelPTKOffline(_channelPTKOffline);
        setChannelLKBOnline(_channelLKBOnline);
        setChannelLKBOffline(_channelLKBOffline);

        setLostReasons(_lostsReason);
        setCategorySales(_categorySales);

        let mySum = 0;
        if(customer.hasOwnProperty('customer_transactions')) {
          let trans = customer.customer_transactions;
          for (let j = 0; j < trans.length; j++) {
            let item = trans[j];
            let tran = {
              myref: customer.myref,
              customer_sales : item.hasOwnProperty('customer_sales') ? parseInt(item.customer_sales) : 0,
              channel : item.channel,
              sale_dt : item.dt,
              sale_wk : moment.unix(item.dt).week(),
              sale_month : moment.unix(item.dt).format('M'),
              sale_year : moment.unix(item.dt).format('YYYY'),
              sale_branch : item.sale_branch,
              name : customer.name,
              register_branch : customer.sale_branch,
              stage : customer.stage,
              channel : customer.channel
            }
            all_transactions.push(tran);
            mySum += tran.customer_sales;
          }
        }
        let myCustomer = {
          name: customer.name,
          customer_sales: mySum,
          sale_branch: customer.sale_branch
        }
        if(mySum > 0) _topSpender.push(myCustomer);
      }
  }
  _topSpender.sort((a,b) => (a.customer_sales > b.customer_sales) ? -1 : ((b.customer_sales > a.customer_sales) ? 1 : 0))
  setTopSpender(_topSpender)
  setTransactions(all_transactions);
  }, [customerList]);
  
  useEffect(async () => {
    let _statSales = 0;
    let _statTargetSales = 0;
    let _statLWSales = 0;

    let _periodSales = []
    let _periodTargetSales = []
    let _periodUCLSales = []
    let _periodPTKSales = []
    let _periodLKBSales = []
    let _AllBranchPeriodSales = []
    if(duration == "YEAR") {
      _periodSales = [0,0,0,0,0,0,0,0,0,0,0,0]
      _AllBranchPeriodSales = [targetSalesUCL, targetSalesLKB, targetSalesPTK]
      _periodTargetSales = _AllBranchPeriodSales.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), []);
      //_periodTargetSales = [40000,40000,45000,44000,55000,50000,60000,55000,55000,53000,48000,50000]
      _periodUCLSales = [0,0,0,0,0,0,0,0,0,0,0,0]
      _periodPTKSales = [0,0,0,0,0,0,0,0,0,0,0,0]
      _periodLKBSales = [0,0,0,0,0,0,0,0,0,0,0,0]
    } else if(duration == "MONTH") {
      _periodSales = [0,0,0,0,0]
      _periodSales = [0,0,0,0,0]
      _periodTargetSales = [0,0,0,0,0]
      _periodUCLSales = [0,0,0,0,0]
      _periodPTKSales = [0,0,0,0,0]
      _periodLKBSales = [0,0,0,0,0]
    }

    let today = moment();
    for(let i=0; i < transactions.length; i++) {
      let tran = transactions[i];
      if(duration == "YEAR") {
        if(tran.sale_year == today.format('YYYY')) {
          _statSales += parseInt(tran.customer_sales);
          _periodSales[tran.sale_month -1] += parseInt(tran.customer_sales);
          if(tran.sale_branch == "พระรามสี่") _periodUCLSales[tran.sale_month -1] += parseInt(tran.customer_sales);
          else if(tran.sale_branch == "พัฒนาการ") _periodPTKSales[tran.sale_month -1] += parseInt(tran.customer_sales);
          else if(tran.sale_branch == "ลาดกระบัง") _periodLKBSales[tran.sale_month -1] += parseInt(tran.customer_sales);
        }
      } else if (duration == "MONTH"){
        if(tran.sale_month == today.format('M')) {
          _statSales += parseInt(tran.customer_sales);
          //_periodSales[tran.sale_month -1] = tran.customer_sales;
          if(tran.sale_branch == "พระรามสี่") _periodUCLSales[tran.sale_month -1] += parseInt(tran.customer_sales);
          else if(tran.sale_branch == "พัฒนาการ") _periodPTKSales[tran.sale_month -1] += parseInt(tran.customer_sales);
          else if(tran.sale_branch == "ลาดกระบัง") _periodLKBSales[tran.sale_month -1] += parseInt(tran.customer_sales);
        }
      }

      if(tran.sale_week < today.week()) _statLWSales += parseInt(tran.customer_sales);
    }

    var _sumUCLSales = _periodUCLSales.reduce(function(a, b){
      return a + b;
    }, 0);
    var _sumPTKSales = _periodPTKSales.reduce(function(a, b){
      return a + b;
    }, 0);
    var _sumLKBSales = _periodLKBSales.reduce(function(a, b){
      return a + b;
    }, 0);

    setSumUCLSales(_sumUCLSales);
    setSumPTKSales(_sumPTKSales);
    setSumLKBSales(_sumLKBSales);

    setStatSales(_statSales);
    setStatLWSales(_statLWSales);
    setPeriodSales(_periodSales);
    setPeriodTargetSales(_periodTargetSales);
    setPeriodUCLSales(_periodUCLSales);
    setPeriodPTKSales(_periodPTKSales);
    setPeriodLKBSales(_periodLKBSales);
  }, [transactions, duration, branch]);

  console.log("Customer list",customerList);
  console.log("Transaction list",transactions);
  console.log("Forecast list", forecastList);
  console.log("Report list", reportList);
  console.log("Target list", targetList);

  const leadConversionBySourceData = [
    {
      "สาขา": "UCL",
      "Online": channelUCLOnline,
      "OnlineColor": "hsl(220, 70%, 50%)",
      "Offline": channelUCLOffline,
      "OfflineColor": "hsl(240, 70%, 50%)"
    },
    {
      "สาขา": "PTK",
      "Online": channelPTKOnline,
      "OnlineColor": "hsl(220, 70%, 50%)",
      "Offline": channelPTKOffline,
      "OfflineColor": "hsl(240, 70%, 50%)"
    },
    {
      "สาขา": "LKB",
      "Online": channelLKBOnline,
      "OnlineColor": "hsl(220, 70%, 50%)",
      "Offline": channelLKBOffline,
      "OfflineColor": "hsl(240, 70%, 50%)"
    },
  ]

  const salesFunnelByBranch = [
    {
      "สถานะ": "Leads",
      "UCL": statLeadsUCL,
      "UCLColor": "hsl(220, 70%, 50%)",
      "PTK": statLeadsPTK,
      "PTKColor": "hsl(240, 70%, 50%)",
      "LKB": statLeadsLKB,
      "LKBColor": "hsl(54, 70%, 50%)",
    },
    {
      "สถานะ": "Customers",
      "UCL": statCustomersUCL,
      "UCLColor": "hsl(220, 70%, 50%)",
      "PTK": statCustomersPTK,
      "PTKColor": "hsl(240, 70%, 50%)",
      "LKB": statCustomersLKB,
      "LKBColor": "hsl(54, 70%, 50%)",
    },
    {
      "สถานะ": "Expansions",
      "UCL": statExpansionsUCL,
      "UCLColor": "hsl(220, 70%, 50%)",
      "PTK": statExpansionsPTK,
      "PTKColor": "hsl(240, 70%, 50%)",
      "LKB": statExpansionsLKB,
      "LKBColor": "hsl(54, 70%, 50%)",
    },
  ]

  function formatted(input) {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formattedSign(input, text="") {
    if(input >= 0) return <label className="positive">{"+" + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + text}</label>;
    else return <label className="negative">{"-" + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + text}</label>;
  }

  function formattedDec(input, text) {
    if(input >= 0) return <label className="positive">{"+" + input.toFixed(2) + text}</label>;
    else return <label className="negative">{"-" + input.toFixed(2) + text}</label>;
  }

  function yearTransaction(year) {
    return transactions.filter(function(transaction) {
      return transaction.year == year && transaction.stage == "Customer"
    });
  }

  function monthTransaction(month) {
    return transactions.filter(function(transaction) {
      return transaction.month == month && transaction.stage == "Customer"
    });
  }

  function weekTransaction(week) {
    return transactions.filter(function(transaction) {
      return transaction.week == week  && transaction.stage == "Customer"
    });
  }

  function sum(array ,key) {
    return targetList !== undefined ? array.reduce((a, b) => a + (parseInt(b[key]) || 0), 0) : 0 ;
  }

  function week(year, month_number) {
    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);
    var used = firstOfMonth.getDay() + lastOfMonth.getDate();
    return Math.ceil( used / 7);
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
        <div>
          <ReactToPdf targetRef={ref} filename="SFL-Report.pdf">
              {({toPdf}) => (
                  <button onClick={toPdf}>Generate pdf</button>
              )}
          </ReactToPdf>
          <div>
            {/*
            <select>
              {
                numberOfWeek.map(function(item, i){
                  return <option value={item} onChange={(e) => {setSelectedWeek(e.target.value)}}>WK{item}</option>
                })
              }
            </select>
            <div>Selected WK{selectedWeek && selectedWeek}</div>
            */}
          </div>
          <Report ref={ref}/>
        </div>
      </div>

      <Navbar active={"Dashboard"} />
    </>
  );

  function Report(props) {
    return (
      <>
      <Formik
          enableReinitialize
          initialValues={{ ...initialForm }}
          validationSchema={formValidation}
          validateOnChange={false}
          validateOnBlur={false}
          
          onSubmit={async (values, { setSubmitting,resetForm }) => {
            setSuccess("")
            console.log(values);
            setSubmitting(true);
            setLoading(true);
            setSubmitting(false);
            setLoading(false);
            let forecast = {
              sales : values.sales ? values.sales : 0,
              customers : values.customers ? values.customers : 0,
              week: moment().week(),
              year: "2021"
            }
            updateForecast("2021", "22", forecast)

            let reports = {
              section1 : values.section1 ? values.section1 : "-",
              section2 : values.section2 ? values.section2 : "-",
              section3 : values.section3 ? values.section3 : "-",
              section4 : values.section4 ? values.section4 : "-",
              section5: values.section5 ? values.section5 : "-",
              section6: values.section6 ? values.section6 : "-",
              section7: values.section7 ? values.section7 : "-",
              section8: values.section8 ? values.section8 : "-",
              section9: values.section9 ? values.section9 : "-",
              section10: values.section10 ? values.section10 : "-",
              section11: values.section11 ? values.section11 : "-",
              section12: values.section12 ? values.section12 : "-",
              section13: values.section13 ? values.section13 : "-",
            }
            updateReport("2021", "22", reports)

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
              <label className="formError">
                {errors.sales && errors.sales}
                {errors.customers && errors.customers}
              </label>

              <div className={"report"} style={{textAlign: "center"}} ref={ref}>
                <div className={"reportCover"}>
                  <h1>Sport for life report</h1>
                  <div>รายงานประจำ WK21</div>
                  <div>23 พฤษภาคม 2564 ถึง 29 พฤษภาคม 2564</div>
                </div>
              </div>

              <div className={"report"} ref={ref}>
                <h1>Sales Performance</h1>
                <div>WK21 - 23 พฤษภาคม 2564 ถึง 29 พฤษภาคม 2564</div>
                <div class="wrapper-one">
                  <div className="graph"  style={{height:"350px"}}>
                <table>
                      <tr>
                        <th>ตัวชี้วัด</th>
                        <th>2021</th>
                        <th>May</th>
                        <th>WK{moment().week()-2}</th>
                        <th>WK{moment().week()-1}</th>
                        <th>คาดกาณ์ WK{moment().week()-1}</th>
                        <th>ผลต่าง</th>
                        <th>คาดการณ์ WK22</th>
                      </tr>
                      <tr>
                        <td>ยอด Sales</td>
                        <td>1,256,294{/*sum(yearTransaction(2021), "customer_sales")*/}</td>
                        <td>1,237,713{/*sum(monthTransaction(5), "customer_sales")*/}</td>
                        <td>5,430{/*sum(weekTransaction(moment().week()-2), "customer_sales")*/}</td>
                        <td>1,003,453{/*sum(weekTransaction(moment().week()-1), "customer_sales")*/}</td>
                        <td>{forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].sales : 0}</td>
                        <td>{sum(weekTransaction(moment().week()-1), "customer_sales") - (forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].sales : 0)}</td>
                        <td>
                          {values.forecastSales}
                          <input
                            type="number"
                            placeholder="Target Sales"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={"sales"}
                            value={values.sales}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Target Sales</td>
                        <td>{formatted(targetList !== undefined && targetList.ucl["2021"].reduce((a, b) => a + (parseInt(b) || 0), 0))}</td>
                        <td>{targetList !== undefined && targetList.ucl["2021"][4] ? targetList.ucl["2021"][4] : 0 }</td>
                        <td>{parseInt((targetList !== undefined && targetList.ucl["2021"][4] ? targetList.ucl["2021"][4] : 0 )*1/week(2021,5))}</td>
                        <td>{parseInt((targetList !== undefined && targetList.ucl["2021"][4] ? targetList.ucl["2021"][4] : 0 )*1/week(2021,5))}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>vs Target</td>
                        <td>-</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>จำนวน Customers</td>
                        <td>{yearTransaction(moment().year()).length}</td>
                        <td>{monthTransaction(moment().month()).length}</td>
                        <td>{weekTransaction(moment().week()-2).length}</td>
                        <td>{weekTransaction(moment().week()-1).length}</td>
                        <td>{forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].customers : 0}</td>
                        <td>{forecastList !== undefined && weekTransaction(moment().week()-1).length - forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].customers : 0}</td>
                        <td>
                          {values.forecastCustomers}
                          <input
                            type="number"
                            placeholder="Target Customers"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={"customers"}
                            value={values.customers}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Sales/Customer</td>
                        <td>{yearTransaction(moment().year()).length == 0 ? "-" : sum(yearTransaction(2021), "customer_sales") / yearTransaction(moment().year()).length}</td>
                        <td>{monthTransaction(moment().month()).length == 0 ? "-" : sum(monthTransaction(5), "customer_sales") / monthTransaction(moment().year()).length}</td>
                        <td>{weekTransaction(moment().week()-2).length == 0 ? "-" : sum(weekTransaction(moment().week()-2), "customer_sales") / weekTransaction(moment().week()-2).length}</td>
                        <td>{weekTransaction(moment().week()-1).length == 0 ? "-" : sum(weekTransaction(moment().week()-1), "customer_sales") / weekTransaction(moment().week()-1).length}</td>
                        <td>{(forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].customers : 0) == 0 ? "-" : (forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].sales : 0) / (forecastList !== undefined && forecastList.hasOwnProperty(["2021-"+moment().week()-1]) ? forecastList["2021-"+moment().week()-1].customers : 0)}</td>
                        <td></td>
                        <td>{values.customers == 0 ? "-" : parseInt(values.sales / values.customers)}</td>
                      </tr>
                    </table>
                </div>
                  <div className="graph" style={{height:"250px"}}>
                <h4>ยอด Sales (Actual VS Target)</h4>
                  <ResponsiveLine
                    data={[
                      {
                        "id": "Actual",
                        "color": "hsl(254, 70%, 50%)",
                        "data": [
                          {
                            "x": "Jan",
                            "y": periodSales && periodSales[0]
                          },
                          {
                            "x": "Feb",
                            "y": periodSales && periodSales[1]
                          },
                          {
                            "x": "Mar",
                            "y": periodSales && periodSales[2]
                          },
                          {
                            "x": "Apr",
                            "y": periodSales && periodSales[3]
                          },
                          {
                            "x": "May",
                            "y": periodSales && periodSales[4]
                          },
                          {
                            "x": "Jun",
                            "y": periodSales && periodSales[5]
                          },
                          {
                            "x": "Jul",
                            "y": periodSales && periodSales[6]
                          },
                          {
                            "x": "Aug",
                            "y": periodSales && periodSales[7]
                          },
                          {
                            "x": "Sep",
                            "y": periodSales && periodSales[8]
                          },
                          {
                            "x": "Oct",
                            "y": periodSales && periodSales[9]
                          },
                          {
                            "x": "Nov",
                            "y": periodSales && periodSales[10]
                          },
                          {
                            "x": "Dec",
                            "y": periodSales && periodSales[11]
                          }
                        ]
                      },
                      {
                        "id": "Target",
                        "color": "hsl(317, 70%, 50%)",
                        "data": [
                          {
                            "x": "Jan",
                            "y": periodTargetSales && periodTargetSales[0]
                          },
                          {
                            "x": "Feb",
                            "y": periodTargetSales && periodTargetSales[1]
                          },
                          {
                            "x": "Mar",
                            "y": periodTargetSales && periodTargetSales[2]
                          },
                          {
                            "x": "Apr",
                            "y": periodTargetSales && periodTargetSales[3]
                          },
                          {
                            "x": "May",
                            "y": periodTargetSales && periodTargetSales[4]
                          },
                          {
                            "x": "Jun",
                            "y": periodTargetSales && periodTargetSales[5]
                          },
                          {
                            "x": "Jul",
                            "y": periodTargetSales && periodTargetSales[6]
                          },
                          {
                            "x": "Aug",
                            "y": periodTargetSales && periodTargetSales[7]
                          },
                          {
                            "x": "Sep",
                            "y": periodTargetSales && periodTargetSales[8]
                          },
                          {
                            "x": "Oct",
                            "y": periodTargetSales && periodTargetSales[9]
                          },
                          {
                            "x": "Nov",
                            "y": periodTargetSales && periodTargetSales[10]
                          },
                          {
                            "x": "Dec",
                            "y": periodTargetSales && periodTargetSales[11]
                          }
                        ]
                      }
                    ]}
                    margin={{ top: 0, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'ช่วงเวลา',
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
                </div>
                  <div>
                    <textarea 
                      type="text"
                      placeholder="Comment"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name={"section1"}>
                    {values.section1}
                    </textarea>
                  </div>
                </div>
              </div>

              <div className={"report"} ref={ref}>
                  <textarea 
                  type="text"
                  placeholder="Comment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name={"section2"}>
                  {values.section2}
                  </textarea>
                <h1>Sales Performance</h1>
                <div>WK21 - 23 พฤษภาคม 2564 ถึง 29 พฤษภาคม 2564</div>
                <div class="wrapper-one">
                  <div className="graph">
                  <h4>ยอด Sales รายสาขา</h4>
      <ResponsiveLine
        data={[
          {
            "id": "UCL",
            "color": "hsl(177, 70%, 50%)",
            "data": [
              {
                "x": "Jan",
                "y": periodUCLSales && periodUCLSales[0]
              },
              {
                "x": "Feb",
                "y": periodUCLSales && periodUCLSales[1]
              },
              {
                "x": "Mar",
                "y": periodUCLSales && periodUCLSales[2]
              },
              {
                "x": "Apr",
                "y": periodUCLSales && periodUCLSales[3]
              },
              {
                "x": "May",
                "y": periodUCLSales && periodUCLSales[4]
              },
              {
                "x": "Jun",
                "y": periodUCLSales && periodUCLSales[5]
              },
              {
                "x": "Jul",
                "y": periodUCLSales && periodUCLSales[6]
              },
              {
                "x": "Aug",
                "y": periodUCLSales && periodUCLSales[7]
              },
              {
                "x": "Sep",
                "y": periodUCLSales && periodUCLSales[8]
              },
              {
                "x": "Oct",
                "y": periodUCLSales && periodUCLSales[9]
              },
              {
                "x": "Nov",
                "y": periodUCLSales && periodUCLSales[10]
              },
              {
                "x": "Dec",
                "y": periodUCLSales && periodUCLSales[11]
              }
            ]
          },
          {
            "id": "LKB",
            "color": "hsl(254, 70%, 50%)",
            "data": [
              {
                "x": "Jan",
                "y": periodLKBSales && periodLKBSales[0]
              },
              {
                "x": "Feb",
                "y": periodLKBSales && periodLKBSales[1]
              },
              {
                "x": "Mar",
                "y": periodLKBSales && periodLKBSales[2]
              },
              {
                "x": "Apr",
                "y": periodLKBSales && periodLKBSales[3]
              },
              {
                "x": "May",
                "y": periodLKBSales && periodLKBSales[4]
              },
              {
                "x": "Jun",
                "y": periodLKBSales && periodLKBSales[5]
              },
              {
                "x": "Jul",
                "y": periodLKBSales && periodLKBSales[6]
              },
              {
                "x": "Aug",
                "y": periodLKBSales && periodLKBSales[7]
              },
              {
                "x": "Sep",
                "y": periodLKBSales && periodLKBSales[8]
              },
              {
                "x": "Oct",
                "y": periodLKBSales && periodLKBSales[9]
              },
              {
                "x": "Nov",
                "y": periodLKBSales && periodLKBSales[10]
              },
              {
                "x": "Dec",
                "y": periodLKBSales && periodLKBSales[11]
              }
            ]
          },
          {
            "id": "PTK",
            "color": "hsl(140, 70%, 50%)",
            "data": [
              {
                "x": "Jan",
                "y": periodPTKSales && periodPTKSales[0]
              },
              {
                "x": "Feb",
                "y": periodPTKSales && periodPTKSales[1]
              },
              {
                "x": "Mar",
                "y": periodPTKSales && periodPTKSales[2]
              },
              {
                "x": "Apr",
                "y": periodPTKSales && periodPTKSales[3]
              },
              {
                "x": "May",
                "y": periodPTKSales && periodPTKSales[4]
              },
              {
                "x": "Jun",
                "y": periodPTKSales && periodPTKSales[5]
              },
              {
                "x": "Jul",
                "y": periodPTKSales && periodPTKSales[6]
              },
              {
                "x": "Aug",
                "y": periodPTKSales && periodPTKSales[7]
              },
              {
                "x": "Sep",
                "y": periodPTKSales && periodPTKSales[8]
              },
              {
                "x": "Oct",
                "y": periodPTKSales && periodPTKSales[9]
              },
              {
                "x": "Nov",
                "y": periodPTKSales && periodPTKSales[10]
              },
              {
                "x": "Dec",
                "y": periodPTKSales && periodPTKSales[11]
              }
            ]
          }
        ]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'ช่วงเวลา',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
                  </div>
                  <div>
                    <div>สาขา UCL</div>
                    <textarea 
                      type="text"
                      placeholder="Comment"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name={"section3"}>
                      {values.section3}
                      </textarea>
                  </div>
                </div>
              </div>
              
              <div className={"report"} ref={ref}>
                <div>สาขา PTK</div>
                <textarea 
                type="text"
                placeholder="Comment"
                onChange={handleChange}
                onBlur={handleBlur}
                name={"section4"}>
                {values.section4}
                </textarea>

                <div>สาขา LKB</div>
                <textarea 
                type="text"
                placeholder="Comment"
                onChange={handleChange}
                onBlur={handleBlur}
                name={"section5"}>
                {values.section5}
                </textarea>
              </div>

              <div className={"report"} ref={ref}>
                <h1>Sales funnel</h1>
                <div>WK21 - 23 พฤษภาคม 2564 ถึง 29 พฤษภาคม 2564</div>
                
                <div class="wrapper-one">
                  <div className="graph" style={{height:"300px"}}>
                    <h4>Sales Funnel</h4>
                    <ResponsiveFunnel
                      data={[
                        {
                          "id": "Leads",
                          "value": statLeads,
                          "label": "Leads"
                        },
                        {
                          "id": "Customers",
                          "value": statCustomers,
                          "label": "Customers"
                        },
                        {
                          "id": "Expansions",
                          "value": statExpansions,
                          "label": "Expansions"
                        }
                      ]}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      direction="horizontal"
                      valueFormat=">-.4s"
                      colors={{ scheme: 'spectral' }}
                      borderWidth={20}
                      labelColor={{ from: 'color', modifiers: [ [ 'darker', 3 ] ] }}
                      beforeSeparatorLength={10}
                      beforeSeparatorOffset={20}
                      afterSeparatorLength={10}
                      afterSeparatorOffset={20}
                      currentPartSizeExtension={10}
                      currentBorderWidth={40}
                      motionConfig="wobbly"
                    />
                  </div>
                  <div className="graph" style={{height:"300px"}}>
                  <h4>Lead แต่ละ Channel</h4>
      <ResponsiveBar
        data={leadConversionBySourceData}
        keys={[ 'Online', 'Offline' ]}
        indexBy="สาขา"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'สาขา',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'จำนวน',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
                  </div>
                  <div>
                    <textarea 
                    type="text"
                    placeholder="Comment"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={"section6"}>
                    {values.section6}
                    </textarea>
                  </div>
                </div>
              </div>

              <div className={"report"} ref={ref}>
                <div class="wrapper-one">
                <div className="graph">
                    <h4>Sales funnel แต่ละสาขา</h4>
                    <ResponsiveBar
                      data={salesFunnelByBranch}
                      keys={[ 'UCL', 'PTK', 'LKB' ]}
                      indexBy="สถานะ"
                      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                      padding={0.3}
                      valueScale={{ type: 'linear' }}
                      indexScale={{ type: 'band', round: true }}
                      colors={{ scheme: 'nivo' }}
                      defs={[
                          {
                              id: 'dots',
                              type: 'patternDots',
                              background: 'inherit',
                              color: '#38bcb2',
                              size: 4,
                              padding: 1,
                              stagger: true
                          },
                          {
                              id: 'lines',
                              type: 'patternLines',
                              background: 'inherit',
                              color: '#eed312',
                              rotation: -45,
                              lineWidth: 6,
                              spacing: 10
                          }
                      ]}
                      fill={[
                          {
                              match: {
                                  id: 'fries'
                              },
                              id: 'dots'
                          },
                          {
                              match: {
                                  id: 'sandwich'
                              },
                              id: 'lines'
                          }
                      ]}
                      borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'สถานะ',
                          legendPosition: 'middle',
                          legendOffset: 32
                      }}
                      axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'จำนวน',
                          legendPosition: 'middle',
                          legendOffset: -40
                      }}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                      legends={[
                          {
                              dataFrom: 'keys',
                              anchor: 'bottom-right',
                              direction: 'column',
                              justify: false,
                              translateX: 120,
                              translateY: 0,
                              itemsSpacing: 2,
                              itemWidth: 100,
                              itemHeight: 20,
                              itemDirection: 'left-to-right',
                              itemOpacity: 0.85,
                              symbolSize: 20,
                              effects: [
                                  {
                                      on: 'hover',
                                      style: {
                                          itemOpacity: 1
                                      }
                                  }
                              ]
                          }
                      ]}
                      animate={true}
                      motionStiffness={90}
                      motionDamping={15}
                  />
                  </div>
                </div>
                <div>สาขา UCL</div>
                <textarea 
                type="text"
                placeholder="Comment"
                onChange={handleChange}
                onBlur={handleBlur}
                name={"section7"}>
                {values.section7}
                </textarea>

                <div>สาขา PTK</div>
                <textarea 
                type="text"
                placeholder="Comment"
                onChange={handleChange}
                onBlur={handleBlur}
                name={"section8"}>
                {values.section8}
                </textarea>
              </div>

              <div className={"report"} ref={ref}>
                <div>สาขา LKB</div>
                <textarea 
                type="text"
                placeholder="Comment"
                onChange={handleChange}
                onBlur={handleBlur}
                name={"section9"}>
                {values.section9}
                </textarea>
                
                <h1>เหตุผลลูกค้า / หมวดหมู่สินค้าที่ Leads สนใจ</h1>
                  <div>WK21 - 23 พฤษภาคม 2564 ถึง 29 พฤษภาคม 2564</div>
                <div class="wrapper-two">
                  <div className="graph">
                  <h4>เหตุผลลูกค้า</h4>
                  <ResponsivePie
          data={lostsReason}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
          defs={[
              {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true
              },
              {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
              }
          ]}
          fill={[
              {
                  match: {
                      id: 'ruby'
                  },
                  id: 'dots'
              },
              {
                  match: {
                      id: 'c'
                  },
                  id: 'dots'
              },
              {
                  match: {
                      id: 'go'
                  },
                  id: 'dots'
              },
              {
                  match: {
                      id: 'python'
                  },
                  id: 'dots'
              },
              {
                  match: {
                      id: 'scala'
                  },
                  id: 'lines'
              },
              {
                  match: {
                      id: 'lisp'
                  },
                  id: 'lines'
              },
              {
                  match: {
                      id: 'elixir'
                  },
                  id: 'lines'
              },
              {
                  match: {
                      id: 'javascript'
                  },
                  id: 'lines'
              }
          ]}
          legends={[
              {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemTextColor: '#000'
                          }
                      }
                  ]
              }
          ]}
      />
                  </div>
                  <div className="graph">
                  <h4>หมวดหมู่สินค้าที่ Leads สนใจ</h4>
                  <ResponsivePie
        data={categorySales}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
                  </div>
                </div>
                <div>
                  <div>โดยรวม</div>
                  <textarea 
                  type="text"
                  placeholder="Comment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name={"section10"}>
                  {values.section10}
                  </textarea>
                </div>
              </div>

              <div className={"report"} ref={ref}>
                <div>สาขา UCL</div>
                  <textarea 
                  type="text"
                  placeholder="Comment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name={"section11"}>
                  {values.section11}
                  </textarea>

                  <div>สาขา PTK</div>
                  <textarea 
                  type="text"
                  placeholder="Comment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name={"section12"}>
                  {values.section12}
                  </textarea>

                  <div>สาขา LKB</div>
                  <textarea 
                  type="text"
                  placeholder="Comment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name={"section13"}>
                  {values.section13}
                  </textarea>
              </div>

              {success && (
              <div className="success">
                {success}
              </div>
              )}
              
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
  </>
    )
  }

  function WeekSelector() {
    for (var i = 1; i <= moment().week(); i++) {
      return <option value={i}>WK{i}</option>
    }
    
  }
}
