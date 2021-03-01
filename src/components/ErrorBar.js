import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import error from "../img/status_error.svg";

export default function ErrorBar(props) {
  return (
    <>
      <div className="status-screen">
        <div className="status-holder">
          <h1>เกิดข้อผิดพลาด</h1>
          <img src={error} className="status-img" />
          <div
            onClick={() => {
              props.setError(false);
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
