"""Runtime configuration loaded from env vars."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Gemini
    gemini_api_key: str = ""
    gemini_model_pro: str = "gemini-2.5-pro"
    gemini_model_flash: str = "gemini-2.5-flash"
    gemini_model_live: str = "gemini-2.5-flash-live"

    # GCP
    gcp_project_id: str = ""
    gcp_region: str = "europe-west1"
    gcp_vertex_index_id: str = ""
    firestore_database: str = "(default)"

    # OAuth
    google_oauth_client_id: str = ""
    google_oauth_client_secret: str = ""
    google_oauth_refresh_token: str = ""

    # Demo recipient labels (shown in simulated phone-call UI — not dialed)
    demo_ahmet_phone: str = ""
    demo_aylin_phone: str = ""
    demo_selin_phone: str = ""

    # Runtime
    port: int = 8080
    log_level: str = "INFO"


settings = Settings()
