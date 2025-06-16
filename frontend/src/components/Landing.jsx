import './Landing.css';

const Landing = () => (
  <div className="landing-bg">
    <div className="landing-overlay">
      <div className="landing-content">
        <h1>Welcome to <span className="brand">iNoteBook</span></h1>
        <p>
          The secure, cloud-based platform to save, organize, and access your notes from anywhere.<br/>
          <span className="highlight">Fast. Secure. Effortless.</span>
        </p>
        <ul>
          <li>📝 Create, edit, and manage your notes easily</li>
          <li>🔒 End-to-end encryption for your privacy</li>
          <li>🌐 Access from any device, anytime</li>
          <li>📱 100% mobile responsive</li>
        </ul>
        <div className="landing-actions">
          <a href="/Signup" className="landing-btn primary">Get Started</a>
          <a href="/Login" className="landing-btn">Login</a>
        </div>
      </div>
    </div>
  </div>
);

export default Landing;
