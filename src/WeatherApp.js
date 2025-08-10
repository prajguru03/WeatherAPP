import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "0a5cbe150dc4ba3b3522ed4706ab178d";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeather(currentRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      // Filter 1 forecast per day
      const daily = forecastRes.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(daily);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  return (
    <div style={styles.container}>
      {weather && (
        <div style={styles.card}>
          <h2>{weather.name}</h2>
          <img
            alt="weather icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
          <h3>{Math.round(weather.main.temp)}°C</h3>
          <p>{weather.weather[0].description}</p>
        </div>
      )}

      <h3>5-Day Forecast</h3>
      <div style={styles.forecast}>
        {forecast.map((day, idx) => (
          <div key={idx} style={styles.forecastCard}>
            <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
            <img
              alt="forecast icon"
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
            />
            <p>{Math.round(day.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial",
    background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    minHeight: "100vh",
    color: "#333",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "300px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  forecast: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  forecastCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "10px",
    width: "100px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
