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

  useEffect(async () => {
    const ref = firebase.firestore().collection("customers");
    const unsubscribe = ref.onSnapshot(
      docSnapshot => {
        let list = [];
        docSnapshot.forEach(function(doc) {
          //console.log(doc.data());
          list.push({ myref: doc.id, ...doc.data() });
        });
        list = list.sort((a, b) => b.dt_lastupdate - a.dt_lastupdate);
        setCustomerList(list);
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );
    return unsubscribe;
  }, []);

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
        dt: moment().unix()
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
          message: "อัพเดทข้อมูลสำเร็จ"
        };
      } catch (error) {
        console.log("ERROR UPDATE", error);
        return {
          status: "success",
          message: "อัพเดทข้อมูลผิดพลาด"
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
          message: "เพิ่มข้อมูลสำเร็จ"
        };
      } catch (error) {
        console.log("ERROR ADD", error);
        return {
          status: "error",
          message: "เพิ่มข้อมูลผิดพลาด"
        };
      }
    }
  }

  const values = { customerList, addCustomer };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
