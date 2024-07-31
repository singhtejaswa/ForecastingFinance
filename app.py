from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from model_wrapper import ModelWrapper

app = Flask(__name__)
CORS(app) 

# Load the model and wrap it
model = joblib.load('wrapped_xgb_model_with_int_predictions.joblib')
model_wrapper = ModelWrapper(model)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Check if all required data fields are present
        required_fields = ['temperature_2m_max', 'temperature_2m_min', 'sunshine_duration', 'precipitation_sum', 'precipitation_hours']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing data: {field}'}), 400
        
        # Convert input data to DataFrame with explicit type casting
        features = pd.DataFrame({
            'temperature_2m_max': [float(data['temperature_2m_max'])],
            'temperature_2m_min': [float(data['temperature_2m_min'])],
            'sunshine_duration': [float(data['sunshine_duration'])],
            'precipitation_sum': [float(data['precipitation_sum'])],
            'precipitation_hours': [float(data['precipitation_hours'])]
        })
        
        # Make prediction using ModelWrapper
        prediction = model_wrapper.predict(features)
        
        # The prediction should be a 2D array with shape (1, 2)
        # We want to calculate the difference between the second and first element
        if prediction.shape == (1, 2):
            open_close_range = int(prediction[0, 1] - prediction[0, 0])
            return jsonify({'predicted_open_close_range': open_close_range})
        else:
            return jsonify({'error': 'Unexpected prediction shape'}), 500
    except ValueError as ve:
        return jsonify({'error': f'Invalid input data: {str(ve)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)