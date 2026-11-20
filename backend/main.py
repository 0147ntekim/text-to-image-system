
import os
import logging

from functools import lru_cache
from pathlib import Path
from mimetypes import guess_type

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from gradio_client import Client


# ==========================================
# 1. APPLICATION CONFIGURATION
# ==========================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ImagineAI API",
    description="Photorealistic image generation powered by RealVisXL V5.0",
    version="1.1.0"
)

# Read allowed frontend origins from environment variables.
# Fall back to local development addresses.
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

origins = [
    origin.strip().rstrip("/")
    for origin in allowed_origins
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPACE_ID = os.getenv(
    "HF_SPACE_ID",
    "obacodes/text-to-image-inference"
)

API_NAME = "/generate_image"


# ==========================================
# 2. REQUEST VALIDATION
# ==========================================

class ImageGenerationRequest(BaseModel):

    prompt: str = Field(
        ...,
        min_length=1,
        max_length=1000
    )

    negative_prompt: str = Field(
        default="",
        max_length=1000
    )

    steps: int = Field(
        default=30,
        ge=10,
        le=40
    )

    guidance_scale: float = Field(
        default=5.5,
        ge=1,
        le=12
    )

    seed: int = Field(
        default=-1,
        ge=-1
    )


# ==========================================
# 3. HUGGING FACE CLIENT
# ==========================================

@lru_cache(maxsize=1)
def get_huggingface_client():

    logger.info("Connecting to Hugging Face Space: %s", SPACE_ID)

    return Client(SPACE_ID)


# ==========================================
# 4. HEALTH CHECK
# ==========================================

@app.get("/")
def home():

    return {
        "message": "ImagineAI API is running",
        "service": "RealVisXL V5.0",
        "inference_provider": "Hugging Face",
        "inference_space": SPACE_ID
    }


@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "service": "ImagineAI API",
        "inference_provider": "Hugging Face"
    }


# ==========================================
# 5. IMAGE GENERATION ENDPOINT
# ==========================================

@app.post("/api/generate")
def generate_image(request: ImageGenerationRequest):

    try:

        client = get_huggingface_client()

        logger.info("Starting image generation request")

        generated_image = client.predict(
            prompt=request.prompt.strip(),
            negative_prompt=request.negative_prompt,
            steps=request.steps,
            guidance_scale=request.guidance_scale,
            seed=request.seed,
            api_name=API_NAME
        )

        image_path = Path(generated_image)

        if not image_path.is_file():

            raise RuntimeError(
                "Generated image file could not be located."
            )

        media_type = guess_type(image_path.name)[0] or "image/png"

        logger.info("Image generation completed successfully")

        return FileResponse(
            path=image_path,
            media_type=media_type,
            filename=image_path.name
        )

    except Exception:

        logger.exception("Image generation failed")

        raise HTTPException(
            status_code=502,
            detail="Image generation failed. Please try again later."
        )
