import Weather from "./Weather.jsx";
import Calendar from "./Calendar.jsx";

const Connections = ({ googleAccessToken }) => {
  return (
    <div className="m-10 mx-40">
      <ul className="list bg-base-100 rounded-box shadow-md border border-gray-200">
        <Weather/>
        <Calendar googleAccessToken={googleAccessToken} />
      </ul>
    </div>
  );
};

export default Connections;
