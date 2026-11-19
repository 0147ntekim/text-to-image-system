
import os
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

app = FastAPI(
    title="Text-to-Image API",
    description="AI image generation using Stable Diffusion 1.5",
    version="1.0.0"
)

# Allow requests from the React development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPACE_ID = os.getenv(
    "HF_SPACE_ID",
    "obacodes/text-to-image-inference"
)


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
        default=20,
        ge=10,
        le=40
    )

    guidance_scale: float = Field(
        default=7.5,
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

    return Client(SPACE_ID)


# ==========================================
# 4. HEALTH CHECK
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Text-to-Image API is running",
        "service": "Stable Diffusion 1.5",
        "inference_space": SPACE_ID
    }


@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "inference_provider": "Hugging Face"
    }


# ==========================================
# 5. IMAGE GENERATION ENDPOINT
# ==========================================

@app.post("/api/generate")
def generate_image(request: ImageGenerationRequest):

    try:

        client = get_huggingface_client()

        # Send the request to our Hugging Face Space.
        generated_image = client.predict(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            steps=request.steps,
            guidance_scale=request.guidance_scale,
            seed=request.seed,
            api_name="/generate_image"
        )

        # Gradio returns a local filepath.
        image_path = Path(generated_image)

        if not image_path.is_file():

            raise RuntimeError(
                "Inference completed but the generated image file "
                "could not be located."
            )

        # Return the generated image to the requester.
        media_type = guess_type(image_path.name)[0] or "image/png"

        return FileResponse(
            path=image_path,
            media_type=media_type,
            filename=image_path.name
        )

    except Exception as error:

        print(f"Image generation error: {error}")

        raise HTTPException(
            status_code=502,
            detail="Image generation failed. Check the inference service and try again."
        )
