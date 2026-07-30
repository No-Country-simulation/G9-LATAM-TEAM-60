import os
import joblib

class ModelLoader:
    def __init__(self):
        self.model = self._load_model()

    def _load_model(self):
        """Carga el modelo serializado .pkl usando una ruta absoluta."""
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "modelo_energiai.pkl")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"No se encontró el archivo del modelo en la ruta: {model_path}")
            
        return joblib.load(model_path)

# Instancia global para ser importada en main.py
model_loader = ModelLoader()