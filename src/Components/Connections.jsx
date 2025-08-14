import React from "react";

const Connections = () => {
  return (
    <div className="m-10 mx-40">
      <ul className="list bg-base-100 rounded-box shadow-md border border-gray-200">
        <li className="list-row">
          <div className="pt-5">
            <img
              className="size-10 rounded-box"
              src="/icons/cloud-solid-full.svg"
            />
          </div>
          <div className="pt-5">
            <div>Weather</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Not Connected
            </div>
          </div>

            <div className="stat">
              <div className="stat-title">temperature</div>
              <div className="stat-value mt-2 text-secondary">76°</div>
            </div>
        </li>

        <li className="list-row">
          <div>
            <img
              className="size-10 rounded-box"
              src="/icons/calendar-solid-full.svg"
            />
          </div>
          <div>
            <div>Google Calendar</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Not Connected
            </div>
          </div>
          <button className="btn btn-ghost">Connect</button>
        </li>
      </ul>
    </div>
  );
};

export default Connections;
