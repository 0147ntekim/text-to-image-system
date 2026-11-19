
function Header() {
  return (
    <header className="app-header">
      <div className="header-container">

        <a href="/" className="brand">
          <span className="brand-icon">✦</span>
          <span>ImagineAI</span>
        </a>

        <nav className="header-nav">
          <a href="#generator">Generator</a>
          <a href="#about">About</a>
        </nav>

        <div className="header-status">
          <span className="status-dot"></span>
          AI Engine Online
        </div>

      </div>
    </header>
  );
}

export default Header;
