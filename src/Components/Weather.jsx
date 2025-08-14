import React, { useState, useEffect } from "react";

// This is a placeholder component to demonstrate a secure API call.
// In a real application, you would replace this URL with the endpoint
// of your own serverless function that securely fetches data from a
// weather API like OpenWeatherMap.
const WEATHER_API_URL =
  `https://api.openweathermap.org/data/2.5/weather?lat=33.669445&lon=-117.823059&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Correctly parse the JSON data to get the temperature, location, and description
        const parsedData = {
          temperature: ((data.main.temp - 273.15) * 9) / 5 + 32, // Convert from Kelvin to Fahrenheit
          location: data.name,
          description: data.weather[0].description,
        };

        setWeatherData(parsedData);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch weather data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <li className="list-row">
        <div className="pt-5 text-center">
          <span className="loading loading-spinner text-primary"></span>
          <p className="mt-2">Loading weather...</p>
        </div>
      </li>
    );
  }

  if (error) {
    return (
      <li className="list-row">
        <p className="text-error">Error: {error}</p>
        <p className="text-sm text-gray-500">Please try refreshing the page.</p>
      </li>
    );
  }

  return (
    <li className="list-row">
      <div className="pt-5">
        <img
          className="size-10 rounded-box"
          src={"/icons/cloud-solid-full.svg"}
        />
      </div>
      <div className="pt-5">
        <div>Weather</div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {weatherData.location}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">temperature</div>
        <div className="stat-value mt-2 text-secondary">
          {Math.round(weatherData.temperature)}°F
        </div>
      </div>
    </li>
  );
}

export default Weather;
