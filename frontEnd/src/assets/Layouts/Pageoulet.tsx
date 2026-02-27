import React from "react";
import Headers from "../../layOuts/Headers";
import { Outlet } from "react-router-dom";
import Footers from "../../layOuts/Footers";
const Pageoulet = () => {
  return (
    <div>
      <Headers />
      <Outlet />
      <Footers />
    </div>
  );
};

export default Pageoulet;
