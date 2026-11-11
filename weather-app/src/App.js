import React, { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function GetWeather() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const currentDateFunction = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const currentDate = new Date();
    return `${weekDays[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}`;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true, error: false });
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = '19d2af9b0584fb482deb19792377bec4';

      await axios
          .get(url, {
            params: {
              q: input,
              units: 'imperial', // imperial returns fahrenheit and mph
              appid: api_key,
            },
          })
          .then((res) => {
            setWeather({ data: res.data, loading: false, error: false });
            setInput('');
          })
          .catch((error) => {
            setWeather({ data: {}, loading: false, error: true });
            setInput('');
            console.error('error', error);
          });
    }
  };

  return (
      <div className="App">
        <h1 className="app-name">Weather App</h1>
        <div className="search-bar">
          <input
              type="text"
              className="city-search"
              placeholder="Enter City Name..."
              name="query"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={search}
          />
        </div>

        {weather.loading && (
            <>
              <br />
              <br />
              <Oval color="black" height={100} width={100} />
            </>
        )}

        {weather.error && (
            <>
              <br />
              <br />
              <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: '20px', marginLeft: '10px' }}>City not found</span>
          </span>
            </>
        )}

        {weather && weather.data && weather.data.main && (
            <div>
              <div className="city-name">
                <h2>
                  {weather.data.name}, <span>{weather.data.sys.country}</span>
                </h2>
              </div>
              <div className="date">
                <span>{currentDateFunction()}</span>
              </div>
              <div className="icon-temp">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                    alt={weather.data.weather[0].description}
                />
                {Math.round(weather.data.main.temp)}
                <sup className="deg">°F</sup>
              </div>
              <div className="des-wind">
                <p style={{ textTransform: 'capitalize' }}>
                  {weather.data.weather[0].description}
                </p>
                <p>Wind Speed: {weather.data.wind.speed} mph</p>
              </div>
            </div>
        )}
      </div>
  );
}

export default GetWeather;