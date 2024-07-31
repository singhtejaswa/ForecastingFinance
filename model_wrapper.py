class ModelWrapper:
    def __init__(self, model):
        self.model = model

    def predict(self, X):
        # Get predictions from the model
        predictions = self.model.predict(X)

        # Print out the predictions for debugging
        print("Predictions:", predictions)

        # Return the predictions
        return predictions
    
    # def predict(self, X):
    # predictions = self.model.predict(X)
    # print("Predictions shape:", predictions.shape)
    # print("Predictions type:", type(predictions))
    # print("Predictions:", predictions)
    # return predictions