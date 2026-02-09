import React from "react";
import './Loading.css'
const Loading = () => {
  return (
    <div>
      <div class="spinner-box">
        <div class="solar-system">
          <div class="earth-orbit orbit">
            <div class="planet earth"></div>
            <div class="venus-orbit orbit">
              <div class="planet venus"></div>
              <div class="mercury-orbit orbit">
                <div class="planet mercury"></div>
                <div class="sun"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex ">

      <p className="text-9xl">Loading</p>
      <div class="spinner-box">
        <div class="pulse-container">
          <div class="pulse-bubble pulse-bubble-1"></div>
          <div class="pulse-bubble pulse-bubble-2"></div>
          <div class="pulse-bubble pulse-bubble-3"></div>
        </div>
      </div>
    </div>
      </div>
  );
};

export default Loading;
