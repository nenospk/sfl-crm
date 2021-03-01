import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import success from "../img/status_success.svg";

export default function SuccessBar(props) {
  return (
    <>
      <div className="status-screen">
        <div className="status-holder">
          <h1>บันทึกสำเร็จ</h1>
          <img src={success} className="status-img" />
          <div
            onClick={() => {
              props.setSuccess(false);
            }}
            className="status-close"
          >
            x ปิดที่นี่
          </div>
        </div>
      </div>
    </>
  );
}
