
function ImagePreview({ imageUrl, isGenerating, error }) {
  return (
    <div className="image-preview">
      <div className="preview-heading">
        <h3>Generated Image</h3>
        <span>512 × 512</span>
      </div>

      <div className="preview-content">
        {isGenerating ? (
          <div className="preview-message">
            <div className="loader"></div>
            <h3>Creating your image...</h3>
            <p>Our AI engine is bringing your imagination to life.</p>
          </div>
        ) : error ? (
          <div className="preview-message error-message">
            <h3>Generation failed</h3>
            <p>{error}</p>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="AI generated artwork"
            className="generated-image"
          />
        ) : (
          <div className="preview-message">
            <div className="preview-placeholder-icon">✦</div>
            <h3>Your image will appear here</h3>
            <p>Enter a prompt and generate your first image.</p>
          </div>
        )}
      </div>

      {imageUrl && !isGenerating && (
        <a
          href={imageUrl}
          download="imagineai-generated.png"
          className="download-button"
        >
          Download Image
        </a>
      )}
    </div>
  );
}

export default ImagePreview;
