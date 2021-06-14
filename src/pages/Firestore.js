import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../firebase";
import moment from "moment";

const AuthContext = React.createContext();

export function useFirestore() {
  return useContext(AuthContext);
}

export function DataProvider({ children }) {
  const [customerList, setCustomerList] = useState();
  const [targetList, setTargetList] = useState();
  const [forecastList, setForecastList] = useState();
  const [reportList, setReportList] = useState();

  useEffect(async () => {
    const ref = firebase.firestore().collection("customers");
    const unsubscribe = ref.onSnapshot(
      (docSnapshot) => {
        let list = [];
        docSnapshot.forEach(function (doc) {
          //console.log(doc.data());
          list.push({ myref: doc.id, ...doc.data() });
        });
        list = list.sort((a, b) => b.dt_lastupdate - a.dt_lastupdate);
        setCustomerList(list);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(async () => {
    const ref = firebase.firestore().collection("target");
    const unsubscribe = ref.onSnapshot(
      (docSnapshot) => {
        let list = {};
        docSnapshot.forEach(function (doc) {
          //console.log(doc.data());
          if (doc.id == "UCL") list.ucl = doc.data();
          if (doc.id == "LKB") list.lkb = doc.data();
          if (doc.id == "PTK") list.ptk = doc.data();
        });
        setTargetList(list);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(async () => {
    const ref = firebase.firestore().collection("forecast");
    const unsubscribe = ref.onSnapshot(
      (docSnapshot) => {
        let list = {};
        docSnapshot.forEach(function (doc) {
          //console.log(doc.data());
          list[doc.id] = doc.data();
        });
        setForecastList(list);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(async () => {
    const ref = firebase.firestore().collection("reports");
    const unsubscribe = ref.onSnapshot(
      (docSnapshot) => {
        let list = {};
        docSnapshot.forEach(function (doc) {
          //console.log(doc.data());
          list[doc.id] = doc.data();
        });
        setReportList(list);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
    return unsubscribe;
  }, []);

  async function updateReport(year, week, reports) {
    try {
      await firebase
        .firestore()
        .collection("reports")
        .doc(year + "-" + week)
        .set(reports);
      console.log("SUCCESS REPORT GOAL");
      return {
        status: "success",
        message: "บันทึกข้อมูลสำเร็จ",
      };
    } catch (error) {
      console.log("ERROR REPORT GOAL", error);
      return {
        status: "error",
        message: "บันทึกข้อมูลผิดพลาด",
      };
    }
  }

  async function updateForecast(year, week, forecast) {
    try {
      await firebase
        .firestore()
        .collection("forecast")
        .doc(year + "-" + week)
        .set(forecast);
      console.log("SUCCESS FORECAST GOAL");
      return {
        status: "success",
        message: "บันทึกข้อมูลสำเร็จ",
      };
    } catch (error) {
      console.log("ERROR FORECAST GOAL", error);
      return {
        status: "error",
        message: "บันทึกข้อมูลผิดพลาด",
      };
    }
  }

  async function updateTarget(year, goal) {
    let ucl_goal = { [year]: goal.ucl };
    let lkb_goal = { [year]: goal.lkb };
    let ptk_goal = { [year]: goal.ptk };
    try {
      await firebase.firestore().collection("target").doc("UCL").set(ucl_goal);
      await firebase.firestore().collection("target").doc("LKB").set(lkb_goal);
      await firebase.firestore().collection("target").doc("PTK").set(ptk_goal);
      console.log("SUCCESS UPDATE GOAL");
      return {
        status: "success",
        message: "บันทึกข้อมูลสำเร็จ",
      };
    } catch (error) {
      console.log("ERROR UPDATE GOAL", error);
      return {
        status: "error",
        message: "บันทึกข้อมูลผิดพลาด",
      };
    }
  }

  async function addCustomer(newData, currentCustomer) {
    //console.log("1", newData);
    let docref = newData.myref;
    delete newData.myref;
    let customer_transactions = [];
    if (currentCustomer) {
      customer_transactions = currentCustomer.customer_transactions;
    }
    //console.log("2", newData);

    newData.dt = moment().unix();
    newData.lastupdate = moment().unix();

    if (newData.stage == "Customer" || newData.stage == "Expansion") {
      let transaction = {
        customer_so: newData.customer_so,
        customer_sales: newData.customer_sales,
        customer_category: newData.customer_category,
        sale_person: newData.sale_person,
        sale_branch: newData.sale_branch,
        channel: newData.channel,
        dt: moment().unix(),
      };
      customer_transactions.push(transaction);
      delete newData.channel;
      delete newData.dt;
      delete newData.sale_person;
      delete newData.sale_branch;
    }
    newData.customer_transactions = customer_transactions;

    delete newData.customer_so;
    delete newData.customer_sales;
    delete newData.customer_category;
    //console.log("3", newData);
    if (docref) {
      console.log("UPDATE", newData);
      try {
        const result = await firebase
          .firestore()
          .collection("customers")
          .doc(docref)
          .update(newData);
        console.log("SUCCESS UPDATE");
        return {
          status: "success",
          message: "อัพเดทข้อมูลสำเร็จ",
        };
      } catch (error) {
        console.log("ERROR UPDATE", error);
        return {
          status: "success",
          message: "อัพเดทข้อมูลผิดพลาด",
        };
      }
    } else {
      console.log("ADD", newData);
      try {
        const result = await firebase
          .firestore()
          .collection("customers")
          .add(newData);
        console.log("SUCCESS ADD");
        return {
          status: "success",
          message: "เพิ่มข้อมูลสำเร็จ",
        };
      } catch (error) {
        console.log("ERROR ADD", error);
        return {
          status: "error",
          message: "เพิ่มข้อมูลผิดพลาด",
        };
      }
    }
  }

  const values = {
    forecastList,
    customerList,
    targetList,
    reportList,
    addCustomer,
    updateTarget,
    updateForecast,
    updateReport,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
