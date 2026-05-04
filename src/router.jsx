import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import PostDetailPage from './pages/public/PostDetailPage';
import SearchPage from './pages/public/SearchPage';
import CategoryTagPage from './pages/public/CategoryTagPage';
import AuthorProfilePage from './pages/public/AuthorProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OAuthSuccessPage from './pages/auth/OAuthSuccessPage';
import AuthorDashboardPage from './pages/author/AuthorDashboardPage';
import CreateEditPostPage from './pages/author/CreateEditPostPage';
import MyPostsPage from './pages/author/MyPostsPage';
import AuthorCommentsPage from './pages/author/AuthorCommentsPage';
import MediaLibraryPage from './pages/author/MediaLibraryPage';
import AuthorAnalyticsPage from './pages/author/AuthorAnalyticsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PostModerationPage from './pages/admin/PostModerationPage';
import TaxonomyManagementPage from './pages/admin/TaxonomyManagementPage';
import AdminCommentsPage from './pages/admin/AdminCommentsPage';
import NewsletterPage from './pages/admin/NewsletterPage';
import PlatformAnalyticsPage from './pages/admin/PlatformAnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import ReaderDashboardPage from './pages/reader/ReaderDashboardPage';
import NotFoundPage from './pages/shared/NotFoundPage';
import ProtectedRoute from './pages/shared/ProtectedRoute';
import NewsletterConfirmPage from './pages/public/NewsletterConfirmPage';
import NewsletterUnsubscribePage from './pages/public/NewsletterUnsubscribePage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/posts/slug/:slug" element={<PostDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:categoryId" element={<CategoryTagPage mode="category" />} />
        <Route path="/tag/:tagId" element={<CategoryTagPage mode="tag" />} />
        <Route path="/author/:authorId" element={<AuthorProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/admin" element={<RegisterPage adminMode />} />
        <Route path="/newsletter/confirm" element={<NewsletterConfirmPage />} />
        <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribePage />} />
        <Route path="/auth/oauth-success" element={<OAuthSuccessPage />} />
        <Route
          path="/reader-dashboard"
          element={(
            <ProtectedRoute allowedRoles={['READER', 'AUTHOR', 'ADMIN']}>
              <ReaderDashboardPage />
            </ProtectedRoute>
          )}
        />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['AUTHOR', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AuthorDashboardPage />} />
        <Route path="posts/new" element={<CreateEditPostPage />} />
        <Route path="posts/:postId/edit" element={<CreateEditPostPage />} />
        <Route path="posts" element={<MyPostsPage />} />
        <Route path="comments" element={<AuthorCommentsPage />} />
        <Route path="media" element={<MediaLibraryPage />} />
        <Route path="analytics" element={<AuthorAnalyticsPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="posts" element={<PostModerationPage />} />
        <Route path="taxonomy" element={<TaxonomyManagementPage />} />
        <Route path="comments" element={<AdminCommentsPage />} />
        <Route path="newsletter" element={<NewsletterPage />} />
        <Route path="analytics" element={<PlatformAnalyticsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

