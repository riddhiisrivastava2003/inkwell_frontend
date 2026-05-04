import { useEffect, useState } from 'react';
import { Col, Row, Form, Container, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiEdit, FiCamera, FiCheckCircle, FiFileText, FiAward, FiExternalLink, FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import Loader from '../../components/common/Loader';
import PostCard from '../../components/post/PostCard';
import authService from '../../services/authService';
import postService from '../../services/postService';
import mediaService from '../../services/mediaService';
import { useAuth } from '../../hooks/useAuth';
import { DEFAULT_AVATAR } from '../../utils/constants';
import { toast } from 'react-hot-toast';

function AuthorProfilePage() {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const authoredPosts = await postService.getPostsByAuthor(authorId);
        setPosts(authoredPosts || []);
        try {
          const authorData = await authService.getUserById(authorId);
          setAuthor(authorData);
          setProfileForm({ fullName: authorData.fullName || '', bio: authorData.bio || '' });
          try {
            const followState = await authService.getFollowStatus(authorId);
            setIsFollowing(Boolean(followState?.following));
            setFollowerCount(Number(followState?.followerCount || 0));
          } catch (_error) {
            setIsFollowing(false);
            setFollowerCount(0);
          }
        } catch (_error) {
          setAuthor({
            id: authorId,
            username: `author_${authorId}`,
            fullName: `Author #${authorId}`,
            bio: 'This author is a key contributor to the InkWell community, sharing stories that move ideas forward.',
          });
          setIsFollowing(false);
          setFollowerCount(0);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authorId]);

  if (loading) return <Loader text="Unfolding author profile..." />;
  const isSelf = String(user?.id) === String(authorId);

  const onUpdateProfile = async (event) => {
    event.preventDefault();
    if (!isSelf || !author?.id) return;
    setSaving(true);
    try {
      let avatarUrl = author.avatarUrl || '';
      if (avatarFile) {
        const uploaded = await mediaService.upload({
          uploaderId: user.id,
          file: avatarFile,
          altText: `${author.username || 'user'} avatar`,
        });
        avatarUrl = uploaded?.url || avatarUrl;
      }

      const updated = await authService.updateUserProfile(author.id, {
        fullName: profileForm.fullName,
        bio: profileForm.bio,
        avatarUrl,
      });
      setAuthor(updated);
      setProfileForm({ fullName: updated.fullName || '', bio: updated.bio || '' });
      setAvatarFile(null);
      setAvatarPreview(null);
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onToggleFollow = async () => {
    if (!user?.id) {
      toast.error('Please log in to follow authors');
      navigate('/login');
      return;
    }
    if (isSelf) return;

    setFollowLoading(true);
    try {
      const response = isFollowing
        ? await authService.unfollowAuthor(authorId)
        : await authService.followAuthor(authorId);
      setIsFollowing(Boolean(response?.following));
      setFollowerCount(Number(response?.followerCount || 0));
      toast.success(isFollowing ? 'Unfollowed author' : 'Now following author');
    } catch (_error) {
      toast.error('Unable to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <PageTransition>
      {/* Profile Header (Hero Section) */}
      <div className="position-relative mb-5">
        <div 
          className="w-100" 
          style={{ 
            height: '280px', 
            background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
            opacity: 0.9
          }}
        ></div>
        <Container className="position-relative" style={{ marginTop: '-80px' }}>
          <div className="bg-white rounded-4 shadow-lg p-4 p-md-5 border-0">
             <Row className="align-items-center g-4">
                <Col xs="auto">
                  <div className="position-relative">
                     <img
                      src={avatarPreview || author?.avatarUrl || DEFAULT_AVATAR}
                      alt={author?.username}
                      className="border border-4 border-white shadow"
                      style={{ width: '150px', height: '150px', borderRadius: '40px', objectFit: 'cover', background: '#fff' }}
                    />
                    {isSelf && (
                      <label className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow-lg" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(10%, 10%)' }}>
                        <FiCamera size={18} />
                        <input type="file" className="d-none" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    )}
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                     <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                           <h1 className="fw-bold serif mb-0" style={{ letterSpacing: '-0.02em' }}>{author?.fullName || author?.username}</h1>
                           {author?.role === 'ADMIN' && <FiCheckCircle className="text-primary" size={24} title="Verified Identity" />}
                           <Badge bg="primary" className="rounded-pill px-3 py-1 small">Top Author</Badge>
                        </div>
                        <p className="text-muted fw-medium mb-2">@{author?.username} • Storyteller & Thinker</p>
                        <div className="d-flex gap-3 text-secondary small">
                           <span className="d-flex align-items-center gap-1"><FiCalendar /> Joined Jan 2026</span>
                           <span className="d-flex align-items-center gap-1"><FiFileText /> {posts.length} Stories</span>
                           <span className="d-flex align-items-center gap-1"><FiUser /> {followerCount} Followers</span>
                        </div>
                     </div>
                     {!isSelf && (
                       <Button
                         variant={isFollowing ? 'outline-secondary' : 'primary'}
                         className="rounded-pill px-4 py-2 fw-bold shadow-sm"
                         onClick={onToggleFollow}
                         disabled={followLoading}
                       >
                         {followLoading ? 'Please wait...' : isFollowing ? 'Unfollow' : 'Follow'}
                       </Button>
                     )}
                  </div>
                </Col>
             </Row>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="g-5">
          {/* Main Content Area */}
          <Col lg={8}>
            <div className="mb-5">
               <h4 className="serif fw-bold mb-4 border-bottom pb-2">Author Biography</h4>
               <p className="text-dark opacity-90" style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
                 {author?.bio || 'This author is a key voice in our community, known for deep insights and compelling narratives that inspire our readers.'}
               </p>
            </div>

            <div className="mb-4 d-flex align-items-center justify-content-between">
               <h4 className="serif fw-bold mb-0">Published Stories</h4>
               <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill">Sort by Newest</Badge>
            </div>

            <AnimatePresence mode="wait">
              {posts.length > 0 ? (
                <Row className="g-4">
                  {posts.map((post) => (
                    <Col md={6} key={post.id}>
                      <PostCard post={post} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                  <FiFileText size={48} className="text-muted mb-3 opacity-30" />
                  <p className="text-secondary fw-medium">No public stories found in this author's archive.</p>
                </div>
              )}
            </AnimatePresence>
          </Col>

          {/* Sidebar Area */}
          <Col lg={4}>
            {isSelf && (
              <div className="bg-white border rounded-4 p-4 mb-4 shadow-sm">
                <h6 className="fw-bold text-uppercase small text-primary mb-4 d-flex align-items-center gap-2">
                  <FiEdit /> Manage Your Profile
                </h6>
                <Form onSubmit={onUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Display Name</Form.Label>
                    <Form.Control 
                      className="bg-light border-0 py-2"
                      value={profileForm.fullName} 
                      onChange={(e) => setProfileForm(p => ({...p, fullName: e.target.value}))}
                      placeholder="Your full name"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">About You</Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={4}
                      className="bg-light border-0 py-2"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(p => ({...p, bio: e.target.value}))}
                      placeholder="Tell your readers your story..."
                      style={{ resize: 'none' }}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100 rounded-pill fw-bold shadow-sm py-2" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Public Profile'}
                  </Button>
                </Form>
              </div>
            )}

            <div className="bg-dark text-white rounded-4 p-4 mb-4 shadow-lg overflow-hidden position-relative">
               <div className="position-relative z-index-1">
                  <h6 className="fw-bold text-uppercase small opacity-50 mb-3">Community Recognition</h6>
                  <div className="d-flex align-items-center gap-3 mb-4">
                     <div className="bg-primary p-2 rounded-3"><FiAward size={24} /></div>
                     <div>
                        <div className="fw-bold">InkWell Trailblazer</div>
                        <div className="small opacity-75">Recognized for quality content</div>
                     </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                     <div className="bg-success p-2 rounded-3"><FiCheckCircle size={24} /></div>
                     <div>
                        <div className="fw-bold">Verified Contributor</div>
                        <div className="small opacity-75">Trusted community member</div>
                     </div>
                  </div>
               </div>
               <FiAward size={100} className="position-absolute end-0 bottom-0 opacity-10" style={{ transform: 'translate(20%, 20%)' }} />
            </div>

            <div className="p-4 bg-light rounded-4 border">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FiTrendingUp /> Author Analytics</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Total Story Views</span>
                  <span className="fw-bold small">1.2k</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Content Reach</span>
                  <span className="fw-bold small">Global</span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top">
                  <span className="text-secondary small">Author ID</span>
                  <span className="text-muted small">#00{authorId}</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </PageTransition>
  );
}

export default AuthorProfilePage;
