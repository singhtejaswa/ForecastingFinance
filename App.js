import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    temperature_2m_max: 25,
    temperature_2m_min: 15,
    sunshine_duration: 8,
    precipitation_sum: 5,
    precipitation_hours: 2
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Sensex Points Prediction";
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📈</text></svg>';
    document.head.appendChild(favicon);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: parseFloat(value) }));
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

  const inputFields = [
    { name: 'temperature_2m_max', label: 'Max Temp (°C)', icon: '🌡' },
    { name: 'temperature_2m_min', label: 'Min Temp (°C)', icon: '❄' },
    { name: 'sunshine_duration', label: 'Sunshine (hrs)', icon: '☀' },
    { name: 'precipitation_sum', label: 'Precip Sum (mm)', icon: '🌧' },
    { name: 'precipitation_hours', label: 'Precip Hours', icon: '⏱' },
  ];

  return (
    <div className="App">
      <div className="background-overlay"></div>
      <header className="App-header">
        <div className="logo">
          <svg viewBox="0 0 100 100" width="50" height="50">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" />
            <path d="M25 70 L40 55 L55 65 L75 30" stroke="white" strokeWidth="5" fill="none" />
          </svg>
        </div>
        <h1 className="glitch" data-text="SENSEX POINTS PREDICTION">SENSEX POINTS PREDICTION</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="input-grid">
            {inputFields.map((field) => (
              <div key={field.name} className="input-container">
                <label htmlFor={field.name}>
                  <span className="input-icon">{field.icon}</span> {field.label}
                </label>
                <input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="input-box"
                />
              </div>
            ))}
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>Predict</>
            )}
          </button>
        </form>
        {prediction !== null && (
          <div className="prediction-result">
            <h2>Prediction Result:</h2>
            <p>Predicted Open-Close Range: <span className="highlight">{prediction}</span></p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

export default App;