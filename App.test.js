import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    temperature_2m_max: 25,
    temperature_2m_min: 15,
    sunshine_duration: 8,
    precipitation_sum: 5,
    precipitation_hours: 2,
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: parseFloat(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setPrediction(response.data.predicted_open_close_range);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForParameter = (name) => {
    switch (name) {
      case 'temperature_2m_max':
        return 'fa-solid fa-temperature-high';
      case 'temperature_2m_min':
        return 'fa-solid fa-temperature-low';
      case 'sunshine_duration':
        return 'fa-solid fa-sun';
      case 'precipitation_sum':
        return 'fa-solid fa-cloud-rain';
      case 'precipitation_hours':
        return 'fa-solid fa-clock';
      default:
        return 'fa-solid fa-question';
    }
  };

  const renderSlider = (name, min, max, step) => (
    <div className="slider-container" key={name}>
      <label htmlFor={name}>
        <i className={`${getIconForParameter(name)}`}></i>
        {name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </label>
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={formData[name]}
        onChange={handleChange}
        className="slider"
      />
      <span className="slider-value">{formData[name]}</span>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          SENSEX POINTS PREDICTION
        </h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="sliders-container">
            {renderSlider('temperature_2m_max', -10, 50, 0.1)}
            {renderSlider('temperature_2m_min', -10, 50, 0.1)}
            {renderSlider('sunshine_duration', 0, 24, 0.1)}
            {renderSlider('precipitation_sum', 0, 100, 0.1)}
            {renderSlider('precipitation_hours', 0, 24, 0.1)}
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <i className="fa-solid fa-calculator"></i> Predict
              </>
            )}
          </button>
        </form>
        {prediction !== null && (
          <div className="prediction-result">
            <h2>
              <i className="fa-solid fa-bullseye"></i> Prediction Result:
            </h2>
            <p className={`prediction-value ${prediction >= 0 ? 'positive' : 'negative'}`}>
              Predicted Open-Close Range: <span className="highlight">{prediction}</span>
            </p>
          </div>
        )}
        {error && (
          <p className="error">
            <i className="fa-solid fa-exclamation-triangle"></i> {error}
          </p>
        )}
      </main>
      <div className="background-graphics">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#3498db"
            d="M39.5,-65.7C51.9,-59.7,63.3,-50.1,71.8,-37.8C80.2,-25.5,85.8,-10.5,84.1,3.4C82.5,17.3,73.7,30.1,64.1,41.1C54.5,52.1,44.1,61.3,32.1,67.4C20.1,73.5,6.4,76.5,-7.1,76.5C-20.6,76.5,-41.2,73.4,-56.3,64.2C-71.4,55,-81,39.6,-85.3,23.3C-89.6,7,-88.6,-10.3,-82.6,-25.1C-76.6,-39.9,-65.5,-52.2,-52.3,-58C-39.1,-63.8,-23.8,-63.1,-9.5,-61.9C4.8,-60.7,27.1,-71.7,39.5,-65.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </div>
  );
}

export default App;