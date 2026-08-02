import os
import joblib
import oci

class ModelLoader:
    def __init__(self):
        # Nombres y rutas del modelo
        self.bucket_name = os.getenv("OCI_BUCKET_NAME", "energiai-models")
        self.object_name = os.getenv("OCI_MODEL_OBJECT_NAME", "modelo_energiai.joblib")
        
        # Ruta absoluta para guardar el archivo descargado en la raíz del servicio
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_path = os.path.join(base_dir, self.object_name)
        
        self.model = self._load_model()

    def _download_from_oci(self):
        """Descarga el archivo del modelo desde el Bucket de OCI Object Storage si no existe localmente."""
        if os.path.exists(self.model_path):
            print(f"--> Modelo encontrado localmente en: {self.model_path}")
            return

        print(f"--> Descargando {self.object_name} desde OCI Bucket '{self.bucket_name}'...")
        
        object_storage_client = None
        oci_config_path = os.path.expanduser("~/.oci/config")

        # 1. Intentar autenticación por archivo de configuración local (~/.oci/config)
        if os.path.exists(oci_config_path):
            try:
                config = oci.config.from_file(file_location=oci_config_path, profile_name="DEFAULT")
                if "key_file" in config:
                    config["key_file"] = os.path.expanduser(config["key_file"])
                
                object_storage_client = oci.object_storage.ObjectStorageClient(config)
                print("--> Autenticado con OCI mediante ~/.oci/config")
            except Exception as e:
                print(f"--> Falló la autenticación con ~/.oci/config: {e}")

        # 2. Fallback: Intentar Resource Principals (para entornos de producción en OCI)
        if object_storage_client is None:
            try:
                signer = oci.auth.signers.get_resource_principals_signer()
                object_storage_client = oci.object_storage.ObjectStorageClient({}, signer=signer)
                print("--> Autenticado con OCI mediante Resource Principals")
            except Exception as e:
                print(f"--> Falló la autenticación por Resource Principals (Esperado fuera de OCI): {e}")

        # Si ningún método funcionó, salir sin lanzar excepción fatal
        if object_storage_client is None:
            print("--> Error: No se pudo configurar ningún cliente de OCI Object Storage.")
            return

        # 3. Descargar el archivo
        try:
            namespace = object_storage_client.get_namespace().data
            get_obj = object_storage_client.get_object(namespace, self.bucket_name, self.object_name)
            
            with open(self.model_path, "wb") as f:
                for chunk in get_obj.data.raw.stream(1024 * 1024, decode_content=False):
                    f.write(chunk)
                    
            print(f"--> ¡Modelo guardado exitosamente en: {self.model_path}!")

        except Exception as e:
            print(f"--> Error al descargar el objeto desde OCI: {e}")

    def _load_model(self):
        """Asegura la descarga desde OCI y carga el modelo .joblib en memoria."""
        # Intenta descargar el modelo si no existe localmente
        self._download_from_oci()

        if not os.path.exists(self.model_path):
            print(f"--> Advertencia: No se encontró el archivo del modelo en: {self.model_path}")
            return None
            
        print(f"--> Cargando modelo en memoria desde: {self.model_path}")
        return joblib.load(self.model_path)

    def load_model(self):
        """Mantiene compatibilidad con la inicialización o llamada externa."""
        if self.model is None:
            self.model = self._load_model()
        return self.model

# Instancia global
model_loader = ModelLoader()