import React from "react";
import Headers from "../../layOuts/Headers";
import { Outlet } from "react-router-dom";
import Footers from "../../layOuts/Footers";
const Pageoulet = () => {
  return (
    <div className="flex flex-col min-h-screen" >
      <Headers />
      <main className="flex-1">
        <Outlet />
      </main>
     
      <Footers />
    </div>
  );
};

export default Pageoulet;
