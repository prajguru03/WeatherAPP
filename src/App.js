import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "0a5cbe150dc4ba3b3522ed4706ab178d";   //API key

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Get user's location on first load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setForecast(forecastRes.data.list.filter((_, index) => index % 8 === 0));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchWeatherByCity = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);
      // 

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      setForecast(forecastRes.data.list.filter((_, index) => index % 8 === 0));
    } catch (err) {
      console.error(err);
      alert("City not found!");
    }
    setLoading(false);
  };

  const getBackgroundClass = () => {
    if (!weather) return "default";
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("cloud")) return "cloudy";
    if (condition.includes("rain")) return "rainy";
    if (condition.includes("clear")) return "sunny";
    if (condition.includes("snow")) return "snowy";
    return "default";
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className="weather-container">
        <h1>🌤 Weather App</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeatherByCity}>Search</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          weather && (
            <div>
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
              <h3>{Math.round(weather.main.temp)}°C</h3>
              <p>{weather.weather[0].description}</p>
              <img
                alt="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              />

              <h3>5-Day Forecast</h3>
              <div className="forecast">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-day">
                    <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                    <img
                      alt="forecast-icon"
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    />
                    <p>{Math.round(day.main.temp)}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
