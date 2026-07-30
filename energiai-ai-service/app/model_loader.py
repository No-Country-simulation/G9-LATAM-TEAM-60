import joblib
import os

# Ruta hacia el archivo del modelo en la raíz de energiai-ai-service/
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "modelo_energiai.pkl")

class ModelLoader:
    def __init__(self):
        self.model = None

    def load_model(self):
        """Carga el modelo serializado .pkl en memoria al iniciar la API."""
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"No se encontró el archivo del modelo en: {MODEL_PATH}")
        
        self.model = joblib.load(MODEL_PATH)
        print("✅ Modelo Machine Learning cargado correctamente en memoria.")
        return self.model

# Instancia global del cargador
model_loader = ModelLoader()