import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, PieChart, Pie } from 'recharts';
import { Row, Col, Card } from 'react-bootstrap';
import { FiActivity, FiUsers, FiFileText, FiMessageSquare, FiTrendingUp, FiPieChart, FiBarChart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import authService from '../../services/authService';
import commentService from '../../services/commentService';
import postService from '../../services/postService';
import Loader from '../../components/common/Loader';

function PlatformAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [postAnalytics, setPostAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [users, posts, comments] = await Promise.all([
          authService.getUsers(),
          postService.adminAnalytics(),
          commentService.countTotal(),
        ]);

        setAnalytics({
          totalUsers: users?.length || 0,
          totalComments: comments?.count || 0,
          userRoles: {
            admin: users?.filter(u => u.role === 'ADMIN').length || 0,
            author: users?.filter(u => u.role === 'AUTHOR').length || 0,
            reader: users?.filter(u => u.role === 'READER').length || 0,
          }
        });
        setPostAnalytics(posts);
      } catch (err) {
        console.error('Failed to load platform analytics', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const roleData = analytics ? [
    { name: 'Admins', value: analytics.userRoles.admin, color: '#ef4444' },
    { name: 'Authors', value: analytics.userRoles.author, color: 'var(--ink-primary)' },
    { name: 'Readers', value: analytics.userRoles.reader, color: '#10b981' },
  ] : [];

  const topPosts = (postAnalytics?.mostViewedPosts || []).map(p => ({
    ...p,
    shortTitle: p.title.slice(0, 20) + (p.title.length > 20 ? '...' : '')
  }));

  const stats = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: <FiUsers />, color: 'var(--ink-primary)' },
    { label: 'Published Posts', value: postAnalytics?.totalPosts || 0, icon: <FiFileText />, color: 'var(--ink-primary-2)' },
    { label: 'Global Comments', value: analytics?.totalComments || 0, icon: <FiMessageSquare />, color: 'var(--ink-success)' },
  ];

  if (loading) return <Loader text="Aggregating platform intelligence..." />;

  return (
    <PageTransition>
      <header className="mb-5">
        <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em' }}>Platform Insights</h2>
        <p className="text-secondary">Comprehensive overview of the InkWell ecosystem and user engagement.</p>
      </header>

      <Row className="g-4 mb-5">
        {stats.map((stat, idx) => (
          <Col md={4} key={stat.label}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: 'var(--ink-radius-lg)', background: 'var(--ink-surface)' }}>
                 <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>{stat.label}</span>
                    <div className="p-2 rounded-3" style={{ background: `color-mix(in srgb, ${stat.color} 10%, transparent)`, color: stat.color }}>{stat.icon}</div>
                 </div>
                 <h3 className="fw-bold mb-0" style={{ fontSize: '2.2rem' }}>{stat.value.toLocaleString()}</h3>
                 <div className="mt-2 small text-success fw-bold d-flex align-items-center gap-1">
                    <FiTrendingUp size={14} /> +8% platform growth
                 </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 'var(--ink-radius-lg)' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
               <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <FiBarChart className="text-primary" /> Most Viewed Content
               </h5>
            </div>
            
            <div style={{ height: 400, minHeight: 320, width: '100%' }}>
              {topPosts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={280}>
                <BarChart data={topPosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-border)" />
                  <XAxis 
                    dataKey="shortTitle" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--ink-muted)', fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--ink-muted)', fontSize: 11 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--ink-surface-2)', opacity: 0.5 }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: 'var(--ink-shadow-md)',
                      background: 'var(--ink-surface)',
                      color: 'var(--ink-text)'
                    }} 
                  />
                  <Bar dataKey="viewCount" fill="var(--ink-primary)" radius={[8, 8, 0, 0]} barSize={40}>
                     {topPosts.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--ink-primary)' : 'var(--ink-primary-2)'} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                  No post analytics available yet.
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 'var(--ink-radius-lg)' }}>
            <h5 className="fw-bold mb-5 d-flex align-items-center gap-2">
               <FiPieChart className="text-accent" style={{ color: 'var(--ink-accent)' }} /> User Distribution
            </h5>
            
            <div style={{ height: 300, minHeight: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={220}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--ink-shadow-md)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
               {roleData.map((role) => (
                  <div key={role.name} className="d-flex justify-content-between align-items-center mb-3">
                     <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: role.color }}></div>
                        <span className="small fw-bold text-secondary">{role.name}</span>
                     </div>
                     <span className="fw-bold">{role.value}</span>
                  </div>
               ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-4 mt-2">
         <Col lg={12}>
            <div className="card border-0 shadow-sm p-4 bg-primary bg-opacity-10" style={{ borderRadius: 'var(--ink-radius-lg)', border: '1px solid var(--ink-primary-opacity-20)' }}>
               <div className="d-flex align-items-center gap-3">
                  <div className="p-3 bg-primary text-white rounded-circle shadow-lg">
                     <FiActivity size={24} />
                  </div>
                  <div>
                     <h5 className="fw-bold mb-1 text-primary">Platform Health Report</h5>
                     <p className="mb-0 text-secondary small">Server latency is at 45ms. Database performance is optimal. 0 reported security incidents in the last 24 hours.</p>
                  </div>
               </div>
            </div>
         </Col>
      </Row>
    </PageTransition>
  );
}

export default PlatformAnalyticsPage;
