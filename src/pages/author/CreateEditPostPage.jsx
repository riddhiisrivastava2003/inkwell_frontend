import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Alert, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { FiSave, FiEye, FiArrowLeft, FiImage, FiType, FiTag, FiLayout, FiCheck, FiInfo, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import RichTextEditor from '../../components/editor/RichTextEditor';
import postService from '../../services/postService';
import mediaService from '../../services/mediaService';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';

function CreateEditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');
  const [featuredFile, setFeaturedFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '<p>Start your masterpiece...</p>',
    featuredImageUrl: '',
    status: 'DRAFT',
    categoryIds: [],
    tagIds: [],
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catData, tagData] = await Promise.all([postService.getCategories(), postService.getTags()]);
        setCategories(catData || []);
        setTags(tagData || []);
        if (postId) {
          const post = await postService.getPostById(postId);
          setForm({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            featuredImageUrl: post.featuredImageUrl || '',
            status: post.status || 'DRAFT',
            categoryIds: (post.categories || []).map((item) => item.id),
            tagIds: (post.tags || []).map((item) => item.id),
          });
        }
      } catch (err) {
        console.error('Failed to load post editor data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      authorId: user.id,
    };

    try {
      if (postId) {
        if (featuredFile) {
          const uploaded = await mediaService.upload({
            uploaderId: user.id,
            file: featuredFile,
            altText: payload.title,
            linkedPostId: Number(postId),
          });
          payload.featuredImageUrl = uploaded?.url || payload.featuredImageUrl;
        }

        await postService.updatePost(postId, payload);
        if (mediaFiles.length > 0) {
          await Promise.all(mediaFiles.map((file) => mediaService.upload({
            uploaderId: user.id,
            file,
            altText: payload.title,
            linkedPostId: Number(postId),
          })));
        }
        setMessage('Your story has been updated.');
      } else {
        const created = await postService.createPost(payload);

        let nextFeatured = payload.featuredImageUrl;
        if (featuredFile && created?.id) {
          const uploaded = await mediaService.upload({
            uploaderId: user.id,
            file: featuredFile,
            altText: payload.title,
            linkedPostId: created.id,
          });
          nextFeatured = uploaded?.url || nextFeatured;
        }

        if (mediaFiles.length > 0 && created?.id) {
          await Promise.all(mediaFiles.map((file) => mediaService.upload({
            uploaderId: user.id,
            file,
            altText: payload.title,
            linkedPostId: created.id,
          })));
        }

        if (nextFeatured && created?.id) {
          await postService.updatePost(created.id, { ...payload, featuredImageUrl: nextFeatured });
        }
        setMessage('Your new story has been created!');
      }

      setTimeout(() => navigate('/dashboard/posts'), 1000);
    } catch (err) {
      console.error('Failed to save post', err);
    } finally {
      setSaving(false);
    }
  };

  const onMultiSelect = (event, field) => {
    const values = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
    setForm((prev) => ({ ...prev, [field]: values }));
  };

  if (loading) return <Loader text="Setting up your editor..." />;

  return (
    <PageTransition>
      <div className="container-fluid py-4">
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <div>
            <Link to="/dashboard/posts" className="text-secondary small fw-bold text-decoration-none d-flex align-items-center gap-1 mb-2">
              <FiArrowLeft /> Back to My Posts
            </Link>
            <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.02em' }}>
               {postId ? 'Edit Story' : 'Craft a New Story'}
            </h2>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
               Cancel
            </button>
            <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm" form="post-form" disabled={saving}>
               {saving ? 'Saving...' : <><FiSave /> {postId ? 'Update' : 'Publish'}</>}
            </button>
          </div>
        </header>

        {message && <Alert variant="success" className="shadow-sm border-0 mb-4" style={{ borderRadius: 'var(--ink-radius-md)' }}>{message}</Alert>}

        <Form id="post-form" onSubmit={onSubmit}>
          <Row className="g-4">
            <Col lg={9}>
               <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 'var(--ink-radius-lg)' }}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-uppercase opacity-75 d-flex align-items-center gap-2">
                       <FiType size={14}/> Title
                    </Form.Label>
                    <Form.Control 
                      className="form-control-lg border-0 bg-light p-3 fw-bold" 
                      style={{ fontSize: '1.5rem', borderRadius: 'var(--ink-radius-sm)' }}
                      value={form.title} 
                      required 
                      placeholder="Enter a captivating title..."
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-uppercase opacity-75 d-flex align-items-center gap-2">
                       <FiLayout size={14}/> Short Excerpt
                    </Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      className="border-0 bg-light p-3"
                      style={{ borderRadius: 'var(--ink-radius-sm)' }}
                      value={form.excerpt} 
                      placeholder="A brief summary to hook your readers..."
                      onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-0">
                    <Form.Label className="small fw-bold text-uppercase opacity-75 d-flex align-items-center gap-2 mb-3">
                       <FiFileText size={14}/> Content
                    </Form.Label>
                    <RichTextEditor value={form.content} onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
                  </Form.Group>
               </div>
            </Col>

            <Col lg={3}>
               <div className="sticky-top" style={{ top: '100px' }}>
                  <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 'var(--ink-radius-lg)' }}>
                    <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                       <FiInfo className="text-primary"/> Publication Settings
                    </h6>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase opacity-75">Status</Form.Label>
                      <Form.Select className="form-select-lg" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="UNPUBLISHED">Unpublished</option>
                        <option value="ARCHIVED">Archived</option>
                      </Form.Select>
                      <div className="mt-2 small text-muted">
                         <FiInfo size={12}/> Published stories are visible to everyone.
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase opacity-75 d-flex align-items-center gap-2">
                         <FiImage size={14}/> Featured Image
                      </Form.Label>
                      <div className="bg-light p-3 rounded-4 mb-3 text-center border-dashed">
                        {form.featuredImageUrl ? (
                          <img src={form.featuredImageUrl} alt="Featured" className="img-fluid rounded mb-2 shadow-sm" style={{ maxHeight: '150px' }} />
                        ) : (
                          <FiImage size={32} className="opacity-25 mb-2" />
                        )}
                        <Form.Control type="file" className="form-control-sm" accept="image/*,video/*,audio/*" onChange={(event) => setFeaturedFile(event.target.files?.[0] || null)} />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase opacity-75">Categories</Form.Label>
                      <Form.Select multiple className="form-select-sm" style={{ height: '100px' }} value={form.categoryIds.map(String)} onChange={(event) => onMultiSelect(event, 'categoryIds')}>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </Form.Select>
                      <small className="text-muted d-block mt-1">Hold Ctrl/Cmd to select multiple</small>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase opacity-75 d-flex align-items-center gap-2">
                         <FiTag size={14}/> Tags
                      </Form.Label>
                      <Form.Select multiple className="form-select-sm" style={{ height: '100px' }} value={form.tagIds.map(String)} onChange={(event) => onMultiSelect(event, 'tagIds')}>
                        {tags.map((tag) => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase opacity-75">Attachments</Form.Label>
                      <Form.Control type="file" className="form-control-sm" accept="image/*,video/*,audio/*" multiple onChange={(event) => setMediaFiles(Array.from(event.target.files || []))} />
                    </Form.Group>
                  </div>
                  
                  <div className="card border-0 p-4 text-white shadow-lg" style={{ background: 'var(--ink-gradient)', borderRadius: 'var(--ink-radius-lg)' }}>
                     <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <FiCheck /> Ready to go?
                     </h6>
                     <p className="small opacity-75 mb-4">Once you publish, your story will be available for readers to discover, like, and comment on.</p>
                     <button className="btn btn-light w-100 fw-bold text-primary rounded-pill shadow-sm" disabled={saving}>
                        {saving ? 'Saving...' : 'Finalize & Publish'}
                     </button>
                  </div>
               </div>
            </Col>
          </Row>
        </Form>
      </div>
    </PageTransition>
  );
}

export default CreateEditPostPage;
