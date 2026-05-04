import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiFeather, FiTwitter, FiGithub, FiInstagram, FiHeart } from 'react-icons/fi';

function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-5" style={{ background: 'var(--ink-surface)', borderTop: '1px solid var(--ink-border)' }}>
      <Container>
        <Row className="g-5 mb-5">
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="bg-primary p-1 rounded-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                <FiFeather size={20} color="white" />
              </div>
              <span className="navbar-brand mb-0 h4 fw-800">InkWell</span>
            </div>
            <p className="text-muted small mb-4 fw-500" style={{ lineHeight: '1.8', maxWidth: '300px' }}>
              A premium home for readers, authors, and visionaries. We believe in the power of narratives to change the world.
            </p>
            <div className="d-flex gap-3">
              {[FiTwitter, FiGithub, FiInstagram].map((Icon, i) => (
                <a key={i} href="#" className="btn btn-light rounded-circle p-2 shadow-sm border text-muted hover-text-primary">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </Col>
          <Col md={4} lg={2}>
            <h6 className="fw-800 serif mb-4 text-uppercase letter-spacing-1 small">Navigation</h6>
            <Nav className="flex-column gap-2">
              <Link to="/" className="text-muted text-decoration-none small hover-text-primary fw-500">Home</Link>
              <Link to="/search" className="text-muted text-decoration-none small hover-text-primary fw-500">Search</Link>
              <Link to="/about" className="text-muted text-decoration-none small hover-text-primary fw-500">About Us</Link>
              <Link to="/privacy" className="text-muted text-decoration-none small hover-text-primary fw-500">Privacy Policy</Link>
            </Nav>
          </Col>
          <Col md={4} lg={2}>
            <h6 className="fw-800 serif mb-4 text-uppercase letter-spacing-1 small">Creators</h6>
            <Nav className="flex-column gap-2">
              <Link to="/dashboard" className="text-muted text-decoration-none small hover-text-primary fw-500">Author Portal</Link>
              <Link to="/dashboard/posts/new" className="text-muted text-decoration-none small hover-text-primary fw-500">Write a Story</Link>
              <Link to="/media" className="text-muted text-decoration-none small hover-text-primary fw-500">Media Assets</Link>
              <Link to="/newsletter" className="text-muted text-decoration-none small hover-text-primary fw-500">Newsletter</Link>
            </Nav>
          </Col>
          <Col md={4} lg={4}>
            <div className="p-4 rounded-4 bg-light border border-dashed">
              <h6 className="fw-800 serif mb-3">Newsletter</h6>
              <p className="small text-muted mb-4">Join 5,000+ others receiving our weekly editorial picks.</p>
              <div className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control bg-white"
                  placeholder="Email"
                  style={{ borderRadius: '0.8rem' }}
                />
                <button className="btn btn-primary px-3 shadow-sm" style={{ borderRadius: '0.8rem' }}>
                  Join
                </button>
              </div>
            </div>
          </Col>
        </Row>

        <div className="pt-5 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <span className="small text-muted fw-600 opacity-75">
            © {year} InkWell Editorial. Built with passion for storytellers.
          </span>
          <div className="d-flex align-items-center gap-1 small text-muted fw-600 opacity-75">
            Crafted with <FiHeart size={14} className="text-danger" /> for the community
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default AppFooter;
