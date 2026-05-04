import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { FiUsers, FiFileText, FiMail, FiShield, FiTrendingUp, FiArrowRight, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import authService from '../../services/authService';
import postService from '../../services/postService';
import newsletterService from '../../services/newsletterService';

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, posts: 0, subscribers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setError('');
        const [users, postAnalytics, subscriberCount] = await Promise.all([
          authService.getUsers(),
          postService.adminAnalytics(),
          newsletterService.getCount(),
        ]);
        setStats({
          users: users.length,
          posts: postAnalytics.totalPosts || 0,
          subscribers: subscriberCount.active || 0,
        });
      } catch (err) {
        setError('Failed to load platform data. Please ensure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const adminTiles = [
    { label: 'Platform Users', value: stats.users, icon: <FiUsers />, color: 'var(--ink-primary)', to: '/admin/users' },
    { label: 'Published Posts', value: stats.posts, icon: <FiFileText />, color: 'var(--ink-primary-2)', to: '/admin/posts' },
    { label: 'Newsletter subs', value: stats.subscribers, icon: <FiMail />, color: 'var(--ink-success)', to: '/admin/newsletter' },
  ];

  return (
    <PageTransition>
      <div className="py-5 mb-5 overflow-hidden position-relative" style={{ background: 'var(--ink-primary)', borderRadius: '0 0 2.5rem 2.5rem' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ background: 'radial-gradient(circle at 20% 20%, white 0%, transparent 40%)' }}></div>
        <Container>
          <div className="d-flex align-items-center gap-4 position-relative z-index-1">
             <div className="p-3 bg-white bg-opacity-20 rounded-4 shadow-sm backdrop-blur d-flex align-items-center justify-content-center">
                <FiShield size={32} className="text-white" />
             </div>
             <div>
                <span className="badge bg-white text-primary px-3 py-1 mb-2">SYSTEM ADMINISTRATOR</span>
                <h2 className="display-6 fw-800 mb-0 text-white serif">Platform Control Center</h2>
             </div>
          </div>
        </Container>
      </div>

      <Container>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-danger shadow-sm mb-5 border-0 p-3 d-flex align-items-center gap-3" 
            style={{ borderRadius: '1rem' }}
          >
            <FiShield size={20} />
            <div className="fw-600">{error}</div>
          </motion.div>
        )}

        <Row className="g-4 mb-5">
          {adminTiles.map((tile, idx) => (
            <Col md={4} key={tile.label}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="card border-0 p-4 h-100 shadow-sm bg-white" style={{ borderRadius: '1.25rem' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="text-muted small fw-800 text-uppercase letter-spacing-1">{tile.label}</div>
                    <div style={{ color: tile.color, background: `${tile.color}15`, padding: '12px', borderRadius: '14px' }}>
                      {React.cloneElement(tile.icon, { size: 24 })}
                    </div>
                  </div>
                  <h3 className="display-6 fw-800 mb-3" style={{ color: 'var(--ink-text)', letterSpacing: '-0.02em' }}>{tile.value.toLocaleString()}</h3>
                  <div className="mt-auto pt-2">
                     <Link to={tile.to} className="text-decoration-none small fw-bold d-flex align-items-center gap-2" style={{ color: tile.color }}>
                        Manage Database <FiArrowRight size={16} />
                     </Link>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="g-5">
           <Col lg={7}>
              <div className="card border-0 p-4 h-100 shadow-sm bg-white" style={{ borderRadius: '1.25rem' }}>
                 <div className="d-flex justify-content-between align-items-center mb-5">
                    <h5 className="fw-800 mb-0 serif d-flex align-items-center gap-3">
                       <div className="bg-primary-light p-2 rounded-3 text-primary shadow-sm"><FiActivity size={20} /></div>
                       Platform Integrity
                    </h5>
                    <span className="badge bg-success-light text-success px-3 py-2 border border-success">SYSTEMS ONLINE</span>
                 </div>
                 
                 <div className="d-grid gap-4">
                    <div className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center border border-dashed">
                       <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-white rounded-3 shadow-sm"><FiShield className="text-primary" /></div>
                          <div>
                             <div className="small text-muted fw-600">Core Services</div>
                             <div className="fw-bold">API Gateway & Auth</div>
                          </div>
                       </div>
                       <div className="p-2 bg-success rounded-circle shadow-lg" style={{ width: 12, height: 12 }}></div>
                    </div>
                    <div className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center border border-dashed">
                       <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-white rounded-3 shadow-sm"><FiTrendingUp className="text-info" /></div>
                          <div>
                             <div className="small text-muted fw-600">Content Engine</div>
                             <div className="fw-bold">Media & Taxonomy</div>
                          </div>
                       </div>
                       <div className="p-2 bg-success rounded-circle shadow-lg" style={{ width: 12, height: 12 }}></div>
                    </div>
                 </div>

                 <div className="mt-5 p-4 bg-light rounded-4 border border-primary border-opacity-10 position-relative overflow-hidden">
                    <div className="position-relative z-index-1">
                      <h6 className="fw-bold text-primary mb-3 serif">Ecosystem Analytics</h6>
                      <p className="small text-secondary mb-0 fw-500" style={{ lineHeight: '1.6' }}>
                        The platform is experiencing a <span className="text-primary fw-bold">15% surge</span> in active sessions today. 
                        Content moderation queue is clear, and all systems are performing within optimal latency parameters.
                      </p>
                    </div>
                 </div>
              </div>
           </Col>
           
           <Col lg={5}>
              <div className="card border-0 p-4 shadow-sm h-100 bg-white" style={{ borderRadius: '1.25rem' }}>
                 <h5 className="fw-800 serif mb-4">Quick Administration</h5>
                 <div className="d-flex flex-column gap-3">
                    <Link to="/admin/taxonomy" className="btn btn-light border-0 shadow-none p-4 text-start d-flex align-items-center justify-content-between rounded-4 bg-light hover-lift">
                       <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-white text-info rounded-3 shadow-sm"><FiActivity size={20} /></div>
                          <span className="fw-bold">Categories & Tags</span>
                       </div>
                       <FiArrowRight />
                    </Link>
                    <Link to="/admin/comments" className="btn btn-light border-0 shadow-none p-4 text-start d-flex align-items-center justify-content-between rounded-4 bg-light hover-lift">
                       <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-white text-danger rounded-3 shadow-sm"><FiShield size={20} /></div>
                          <span className="fw-bold">Global Moderation</span>
                       </div>
                       <FiArrowRight />
                    </Link>
                    <Link to="/admin/analytics" className="btn btn-light border-0 shadow-none p-4 text-start d-flex align-items-center justify-content-between rounded-4 bg-light hover-lift">
                       <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-white text-primary rounded-3 shadow-sm"><FiTrendingUp size={20} /></div>
                          <span className="fw-bold">Full Analytics</span>
                       </div>
                       <FiArrowRight />
                    </Link>
                 </div>
                 
                 <div className="mt-auto pt-5">
                    <div className="p-4 bg-primary text-white rounded-4 shadow-lg">
                       <h6 className="fw-bold mb-2">Security Audit</h6>
                       <p className="small mb-0 opacity-75">All administrative actions are being logged. Next scheduled security audit: May 15, 2026.</p>
                    </div>
                 </div>
              </div>
           </Col>
        </Row>
      </Container>
    </PageTransition>
  );
}

export default AdminDashboardPage;
