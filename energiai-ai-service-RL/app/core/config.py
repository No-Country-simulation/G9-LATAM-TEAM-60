import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EnergIA AI Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # OCI Configuration
    OCI_BUCKET_NAME: str = os.getenv("OCI_BUCKET_NAME", "energiai-models")
    OCI_MODEL_OBJECT_NAME: str = os.getenv("OCI_MODEL_OBJECT_NAME", "modelo_energiai.joblib")

    class Config:
        case_sensitive = True

settings = Settings()