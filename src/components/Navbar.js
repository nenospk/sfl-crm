import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./style.css";

import navInsert from "../img/nav_insert.svg";
import navView from "../img/nav_view.svg";
import navDashoboard from "../img/nav_dashboard.svg";
import navSignout from "../img/nav_signout.svg";

export default function Navbar(props) {
  return (
    <>
      <div style={{ paddingBottom: "100px" }} />
      <div className={"container"}>
        <div className="navigator">
          <Link
            to="/"
            className={
              "nav-item " + (props.active == "กรอกข้อมูล" ? "active" : "")
            }
          >
            <div className="nav-holder">
              <img src={navInsert} className="nav-icn" />
              <div className="line-break" />
              <div className="nav_content">กรอกข้อมูล</div>
            </div>
            <div className={"nav_status"} />
          </Link>

          <Link
            to="/view"
            className={
              "nav-item " + (props.active == "ดูข้อมูล" ? "active" : "")
            }
          >
            <div className="nav-holder">
              <img src={navView} className="nav-icn" />
              <div className="line-break" />
              <div className="nav_content">ดูข้อมูล</div>
            </div>
            <div className={"nav_status"} />
          </Link>

          <Link
            to="/dashboard"
            className={
              "nav-item " + (props.active == "Dashboard" ? "active" : "")
            }
          >
            <div className="nav-holder">
              <img src={navDashoboard} className="nav-icn" />
              <div className="line-break" />
              <div className="nav_content">Dashboard</div>
            </div>
            <div className={"nav_status"} />
          </Link>

          <Link
            to="/signout"
            className={
              "nav-item " + (props.active == "ออกจากระบบ" ? "active" : "")
            }
          >
            <div className="nav-holder">
              <img src={navSignout} className="nav-icn" />
              <div className="line-break" />
              <div className="nav_content">ออกจากระบบ</div>
            </div>
            <div className={"nav_status ช"} />
          </Link>
        </div>
      </div>
    </>
  );
}
