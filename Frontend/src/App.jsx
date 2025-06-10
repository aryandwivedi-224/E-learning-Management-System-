import { useState, useEffect } from 'react'
import ErrorBoundary from "./components/ErrorBoundary"
import './App.css'
import Login from './Pages/Login';
import { Provider } from 'react-redux';
import store from './app/store';
import HeroSection from './Pages/student/HeroSection'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Courses from './Pages/student/Courses';
import MyLearning from './Pages/student/Mylearning';
import Profile from './Pages/student/Profile';
import { useLoadUserQuery } from './features/api/authapi';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Sidebar from './Pages/admin/Sidebar';
import Dashboard from './Pages/admin/Dashboard';
import CourseTable from './Pages/admin/course/CourseTable';
import AddCourse from './Pages/admin/course/AddCourse';
import EditCourse from './Pages/admin/course/EditCourse';
import CreateLecture from './Pages/admin/lecture/CreateLecture';
import EditLecture from './Pages/admin/lecture/EditLecture';
import CourseDetail from './Pages/student/CourseDetail';
import SearchPage from './Pages/SearchPage';
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ui/ProtectedRoute';
import PurchaseCourseProtectedRoute from './components/ui/PurchaseCourseProtectedRoute';

const AppContent = () => {
  // Load user data on app initialization
  const { isLoading } = useLoadUserQuery();

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "login",
          element: (
            <AuthenticatedUser>
              <Login />
             </AuthenticatedUser>
          ),
        },
        {
          path: "my-learning",
          element: (
            <ProtectedRoute>
              <MyLearning />
             </ProtectedRoute> 
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
             </ProtectedRoute>
          ),
        },
        {
          path: "course/search",
          element: (
            <ProtectedRoute>
              <SearchPage />
             </ProtectedRoute>
          ),
        },
        {
          path: "course-detail/:courseId",
          element: (
             <ProtectedRoute>
              <CourseDetail />
             </ProtectedRoute>
          ),
        },
        // {
        //   path: "course-progress/:courseId",
        //   element: (
        //     <ProtectedRoute>
        //       <PurchaseCourseProtectedRoute>
        //       <CourseProgress />
        //       </PurchaseCourseProtectedRoute>
        //     </ProtectedRoute>
        //   ),
        // },
  
        // admin routes start from here
        {
          path: "admin",
          element: (
            <AdminRoute>
              <Sidebar />
             </AdminRoute>
          ),
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "course",
              element: <CourseTable />,
            },
            {
              path: "course/create",
              element: <AddCourse />,
            },
            {
              path: "course/:courseId",
              element: <EditCourse />,
            },
            {
              path: "course/:courseId/lecture",
              element: <CreateLecture />,
            },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: <EditLecture />,
            },
          ],
        },
      ],
    },
  ]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <RouterProvider router={appRouter} />;
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  )
}

export default App
