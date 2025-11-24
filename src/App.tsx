import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import PostsPage from './pages/PostsPage';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import AuthorPage from './pages/AuthorPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminLayout from './components/analytics/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ui/ErrorBoundary';
import BookmarksPage from './pages/BookmarksPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentsPage from './pages/PaymentsPage';
import LikedPostsPage from './pages/LikedPostsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotesPage from './pages/NotesPage';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="post/:slug" element={<PostPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="tag/:slug" element={<TagPage />} />
        <Route path="author/:username" element={<AuthorPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-post"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookmarks"
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="subscription"
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
               <Route
                 path="liked-posts"
                 element={
                   <ProtectedRoute>
                     <LikedPostsPage />
                   </ProtectedRoute>
                 }
               />
               <Route
                 path="notes"
                 element={
                   <ProtectedRoute>
                     <NotesPage />
                   </ProtectedRoute>
                 }
               />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </ErrorBoundary>
  );
}

export default App;

