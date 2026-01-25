import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Page1 from "../survey/screens/Page1";
import Page2 from "../survey/screens/Page2";
import Page3 from "../survey/screens/Page3";
import Page4 from "../survey/screens/Page4";
import Page5 from "../survey/screens/Page5";
import Page6 from "../survey/screens/Page6";
import Page7 from "../survey/screens/Page7";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/user" element={<Page2 />} />
        <Route path="/sensitivity-intro" element={<Page3 />} />
        <Route path="/sensitivity" element={<Page4 />} />
        <Route path="/perception-intro" element={<Page5 />} />
        <Route path="/perception" element={<Page6 />} />
        <Route path="/thank-you" element={<Page7 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
