import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import mainLogo from "../img/sfl_logo.svg";

export default function LoadingBar() {
  return (
    <>
      <div className="loading-screen">
        <div className="loading-holder">
          <img src={mainLogo} />
          {/*<div>กำลังโหลดข้อมูล ...</div>*/}
        </div>
      </div>
    </>
  );
}
