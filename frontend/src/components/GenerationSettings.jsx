
function GenerationSettings({
  steps,
  setSteps,
  guidanceScale,
  setGuidanceScale,
  seed,
  setSeed,
}) {
  return (
    <div className="generation-settings">
      <div className="settings-heading">
        <h3>Generation Settings</h3>
        <p>Adjust how the AI creates your image.</p>
      </div>

      <div className="setting-group">
        <div className="setting-label">
          <label htmlFor="steps">Inference Steps</label>
          <span>{steps}</span>
        </div>

        <input
          id="steps"
          type="range"
          min="10"
          max="40"
          step="1"
          value={steps}
          onChange={(event) => setSteps(Number(event.target.value))}
        />

        <small>
          Higher values can improve refinement but increase generation time.
        </small>
      </div>

      <div className="setting-group">
        <div className="setting-label">
          <label htmlFor="guidance">Guidance Scale</label>
          <span>{guidanceScale}</span>
        </div>

        <input
          id="guidance"
          type="range"
          min="1"
          max="12"
          step="0.5"
          value={guidanceScale}
          onChange={(event) =>
            setGuidanceScale(Number(event.target.value))
          }
        />

        <small>
          Controls how closely the generated image follows your prompt.
        </small>
      </div>

      <div className="setting-group">
        <div className="setting-label">
          <label htmlFor="seed">Seed</label>
        </div>

        <input
          id="seed"
          type="number"
          value={seed}
          min="-1"
          onChange={(event) => {
            const value = event.target.value;
            setSeed(value === "" ? "" : Number(value));
          }}
        />

        <small>
          Use -1 for a random seed. A fixed seed can help reproduce results.
        </small>
      </div>
    </div>
  );
}

export default GenerationSettings;
