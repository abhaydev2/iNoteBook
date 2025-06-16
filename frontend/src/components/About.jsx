import './About.css';

const About = () => {
  return (
    <div className="about-bg">
      <div className="about-overlay">
        <div className="about-content">
          <h1>About iNoteBook</h1>
          <p>
            <b>iNoteBook</b> is your secure, cloud-based note-taking platform.
            Effortlessly save, organize, and access your notes from anywhere, on
            any device. Your notes are protected with high-end security and
            encryption, ensuring your privacy and peace of mind.
          </p>
          <ul>
            <li>📝 Create, edit, and delete notes instantly</li>
            <li>🔒 All notes are encrypted and stored securely</li>
            <li>🌐 Access your notes from any device, anytime</li>
            <li>📱 Fully mobile responsive for on-the-go productivity</li>
          </ul>
          <p
            style={{
              marginTop: '2rem',
              fontWeight: 500,
            }}
          >
            Start organizing your thoughts with{' '}
            <span style={{ color: '#4f8cff' }}>iNoteBook</span> today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;