import joblib
import numpy as np
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load the trained models from the .pkl files
with open("/Users/sirawitkc/Desktop/Mindful-Cycle/MLAPI/model/Anxiety.pkl", "rb") as file:
    model1 = joblib.load(file)

with open("/Users/sirawitkc/Desktop/Mindful-Cycle/MLAPI/model/Depression.pkl", "rb") as file:
    model2 = joblib.load(file)

with open("/Users/sirawitkc/Desktop/Mindful-Cycle/MLAPI/model/Stress.pkl", "rb") as file:
    model3 = joblib.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.json['input']
        model_name = request.json['model']
        
        input_data = np.array(data, dtype=int).reshape(1, -1)

        # Select the model based on the request
        if model_name == 'model1':
            prediction = model1.predict(input_data)
        elif model_name == 'model2':
            prediction = model2.predict(input_data)
        elif model_name == 'model3':
            prediction = model3.predict(input_data)
        else:
            return jsonify({'error': 'Invalid model name'}), 400

        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
