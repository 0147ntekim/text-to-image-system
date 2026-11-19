
import { useEffect, useState } from "react";

import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import GenerationSettings from "./components/GenerationSettings";
import ImagePreview from "./components/ImagePreview";

import { generateImage } from "./services/api";

import "./App.css";

function App() {
  // Prompt states
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  // Generation settings
  const [steps, setSteps] = useState(20);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(-1);

  // Application states
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");

  // Release temporary image URLs when replaced or unmounted
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  async function handleGenerate(event) {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a description for your image.");
      return;
    }

    if (prompt.length > 1000 || negativePrompt.length > 1000) {
      setError("Your prompts cannot exceed 1000 characters.");
      return;
    }

    if (!Number.isInteger(seed) || seed < -1) {
      setError("Seed must be an integer greater than or equal to -1.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const payload = {
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim(),
        steps,
        guidance_scale: guidanceScale,
        seed,
      };

      const imageBlob = await generateImage(payload);

      const newImageUrl = URL.createObjectURL(imageBlob);

      setImageUrl(newImageUrl);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <section className="hero-section">
          <span className="eyebrow">
            AI-POWERED IMAGE GENERATION
          </span>

          <h1>
            Your imagination.
            <span> Without limits.</span>
          </h1>

          <p>
            Transform your ideas into stunning visuals
            using artificial intelligence.
          </p>
        </section>

        <section className="generator-section" id="generator">
          <div className="section-heading">
            <h2>Image Studio</h2>
            <p>Describe what you want to create.</p>
          </div>

          <div className="studio-layout">
            <form
              className="studio-controls"
              onSubmit={handleGenerate}
            >
              <PromptForm
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
              />

              <GenerationSettings
                steps={steps}
                setSteps={setSteps}
                guidanceScale={guidanceScale}
                setGuidanceScale={setGuidanceScale}
                seed={seed}
                setSeed={setSeed}
              />

              <button
                type="submit"
                className="generate-button"
                disabled={isGenerating}
              >
                {isGenerating
                  ? "Generating Image..."
                  : "✦ Generate Image"}
              </button>
            </form>

            <ImagePreview
              imageUrl={imageUrl}
              isGenerating={isGenerating}
              error={error}
            />
          </div>
        </section>
      </main>

      <footer className="app-footer" id="about">
        <p>ImagineAI · Powered by Stable Diffusion 1.5</p>
      </footer>
    </div>
  );
}

export default App;
