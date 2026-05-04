import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from 'recharts';
import { Row, Col } from 'react-bootstrap';
import { FiTrendingUp, FiEye, FiHeart, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';

function AuthorAnalyticsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postData, comments] = await Promise.all([
          postService.getPostsByAuthor(user.id),
          commentService.countTotal(),
        ]);
        setPosts(postData || []);
        setCommentCount(comments.count || 0);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) load();
  }, [user?.id]);

  const chartData = posts.map((post) => ({
    name: post.title.slice(0, 15) + (post.title.length > 15 ? '...' : ''),
    fullName: post.title,
    views: post.viewCount || 0,
    likes: post.likesCount || 0,
  })).sort((a, b) => b.views - a.views).slice(0, 10);

  const totals = posts.reduce(
    (acc, post) => ({
      views: acc.views + (post.viewCount || 0),
      likes: acc.likes + (post.likesCount || 0),
      comments: commentCount,
    }),
    { views: 0, likes: 0, comments: 0 },
  );

  const stats = [
    { label: 'Total Views', value: totals.views, icon: <FiEye />, color: 'var(--ink-primary)' },
    { label: 'Total Likes', value: totals.likes, icon: <FiHeart />, color: 'var(--ink-danger)' },
    { label: 'Comments', value: totals.comments, icon: <FiMessageSquare />, color: 'var(--ink-success)' },
  ];

  if (loading) return <Loader text="Calculating performance metrics..." />;

  return (
    <PageTransition>
      <header className="mb-5">
        <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em' }}>Analytics Insights</h2>
        <p className="text-secondary">Track your growth and understand what resonates with your readers.</p>
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
                 <h3 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>{stat.value.toLocaleString()}</h3>
                 <div className="mt-2 small text-success fw-bold d-flex align-items-center gap-1">
                    <FiTrendingUp size={14} /> +12% from last month
                 </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
         <Col lg={12}>
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--ink-radius-lg)' }}>
               <div className="d-flex justify-content-between align-items-center mb-5">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                     <FiBarChart2 className="text-primary" /> Top Performing Stories
                  </h5>
               </div>
               
               <div style={{ height: 400, minHeight: 320, width: '100%' }}>
                  {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={280}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--ink-primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--ink-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-border)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--ink-muted)', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--ink-muted)', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: 'var(--ink-shadow-md)',
                          background: 'var(--ink-surface)',
                          color: 'var(--ink-text)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="var(--ink-primary)" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  ) : (
                    <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                      No chart data available yet.
                    </div>
                  )}
               </div>
            </div>
         </Col>
         
         <Col lg={12}>
            <div className="card border-0 shadow-sm p-4 mt-4" style={{ borderRadius: 'var(--ink-radius-lg)' }}>
               <h5 className="fw-bold mb-4">Engagement Breakdown</h5>
               <div className="table-responsive">
                  <table className="table table-hover align-middle">
                     <thead className="bg-light">
                        <tr>
                           <th className="border-0 small text-uppercase py-3">Story Title</th>
                           <th className="border-0 small text-uppercase py-3">Views</th>
                           <th className="border-0 small text-uppercase py-3">Likes</th>
                           <th className="border-0 small text-uppercase py-3">Engagement Rate</th>
                        </tr>
                     </thead>
                     <tbody>
                        {posts.sort((a,b) => b.viewCount - a.viewCount).slice(0, 5).map((post) => (
                           <tr key={post.id}>
                              <td className="py-3 fw-bold">{post.title}</td>
                              <td className="py-3">{post.viewCount || 0}</td>
                              <td className="py-3">{post.likesCount || 0}</td>
                              <td className="py-3">
                                 <div className="d-flex align-items-center gap-2">
                                    <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: '10px' }}>
                                       <div 
                                         className="progress-bar bg-primary" 
                                         style={{ width: `${Math.min(100, ((post.likesCount || 0) / (post.viewCount || 1)) * 100 * 5)}%` }}
                                       ></div>
                                    </div>
                                    <span className="small fw-bold">
                                       {((post.likesCount || 0) / (post.viewCount || 1) * 100).toFixed(1)}%
                                    </span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </Col>
      </Row>
    </PageTransition>
  );
}

export default AuthorAnalyticsPage;
