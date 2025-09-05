import React, { useState, useEffect } from "react";

function ColorSensorCard() {
  return (
    <li className="list-row">
      <div className="pt-5">
        <img
          className="size-10 rounded-box"
          src={"/icons/palette-solid-full.svg"}
        />
      </div>
      <div className="pt-5">
        <div>Colthing</div>
        <div className="text-xs uppercase font-semibold opacity-60">
          Color
        </div>
      </div>

      <div className="stat">
        <div className="stat-title"></div>
        <div className="stat-value mt-2 text-secondary">
          Red
        </div>
      </div>
    </li>
  );
}

export default ColorSensorCard;
