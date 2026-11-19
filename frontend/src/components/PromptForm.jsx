
function PromptForm({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
}) {
  return (
    <div className="prompt-form">
      <div className="form-group">
        <label htmlFor="prompt">Describe your image</label>

        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="A futuristic African city at sunset, cinematic lighting, highly detailed..."
          rows={5}
          maxLength={1000}
        />

        <div className="character-count">
          {prompt.length}/1000 characters
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="negative-prompt">
          Negative prompt
          <span className="optional-label">Optional</span>
        </label>

        <textarea
          id="negative-prompt"
          value={negativePrompt}
          onChange={(event) => setNegativePrompt(event.target.value)}
          placeholder="Blurry, distorted faces, low quality, extra fingers..."
          rows={3}
          maxLength={1000}
        />
      </div>
    </div>
  );
}

export default PromptForm;
