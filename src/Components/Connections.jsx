import Weather from "./Weather.jsx";
import Calendar from "./Calendar.jsx";
import ColorSensorCard from './ColorSensorCard.jsx';


const Connections = ({ googleAccessToken, onUpdateEvents }) => {
  return (
    <div className="m-10 mx-40">
      <ul className="list bg-base-100 rounded-box shadow-md border border-gray-200">
        <Weather/>
        <ColorSensorCard/>
      <Calendar googleAccessToken={googleAccessToken} onUpdateEvents={onUpdateEvents} />
      </ul>
    </div>
  );
};

export default Connections;