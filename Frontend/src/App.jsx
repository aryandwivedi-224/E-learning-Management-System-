// import { useState, useEffect } from 'react'
// import ErrorBoundary from "./components/ErrorBoundary"
// import './App.css'
// import Login from './Pages/Login';
// import { Provider } from 'react-redux';
// import store from './app/store';
// import HeroSection from './Pages/student/HeroSection'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import MainLayout from './layout/MainLayout';
// import Courses from './Pages/student/Courses';
// import MyLearning from './Pages/student/MyLearning';
// import Profile from './Pages/student/Profile';
// import { useLoadUserQuery } from './features/api/authapi';
// import LoadingSpinner from './components/ui/LoadingSpinner';
// import Sidebar from './Pages/admin/Sidebar';
// import Dashboard from './Pages/admin/Dashboard';
// import CourseTable from './Pages/admin/course/CourseTable';
// import AddCourse from './Pages/admin/course/AddCourse';
// import EditCourse from './Pages/admin/course/EditCourse';
// import CreateLecture from './Pages/admin/lecture/CreateLecture';
// import EditLecture from './Pages/admin/lecture/EditLecture';
// import CourseDetail from './Pages/student/CourseDetail';
// import SearchPage from './Pages/SearchPage';
// import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ui/ProtectedRoute';
// import PurchaseCourseProtectedRoute from './components/ui/PurchaseCourseProtectedRoute';

// const AppContent = () => {
//   // Load user data on app initialization
//   const { isLoading } = useLoadUserQuery();

//   const appRouter = createBrowserRouter([
//     {
//       path: "/",
//       element: <MainLayout />,
//       children: [
//         {
//           path: "/",
//           element: (
//             <>
//               <HeroSection />
//               <Courses />
//             </>
//           ),
//         },
//         {
//           path: "login",
//           element: (
//             <AuthenticatedUser>
//               <Login />
//             </AuthenticatedUser>
//           ),
//         },
//         {
//           path: "my-learning",
//           element: (
//             <ProtectedRoute>
//               <MyLearning />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "profile",
//           element: (
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "course/search",
//           element: (
//             <ProtectedRoute>
//               <SearchPage />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "course-detail/:courseId",
//           element: (
//             <ProtectedRoute>
//               <CourseDetail />
//             </ProtectedRoute>
//           ),
//         },
//         // {
//         //   path: "course-progress/:courseId",
//         //   element: (
//         //     <ProtectedRoute>
//         //       <PurchaseCourseProtectedRoute>
//         //       <CourseProgress />
//         //       </PurchaseCourseProtectedRoute>
//         //     </ProtectedRoute>
//         //   ),
//         // },

//         // admin routes start from here
//         {
//           path: "admin",
//           element: (
//             <AdminRoute>
//               <Sidebar />
//             </AdminRoute>
//           ),
//           children: [
//             {
//               path: "dashboard",
//               element: <Dashboard />,
//             },
//             {
//               path: "course",
//               element: <CourseTable />,
//             },
//             {
//               path: "course/create",
//               element: <AddCourse />,
//             },
//             {
//               path: "course/:courseId",
//               element: <EditCourse />,
//             },
//             {
//               path: "course/:courseId/lecture",
//               element: <CreateLecture />,
//             },
//             {
//               path: "course/:courseId/lecture/:lectureId",
//               element: <EditLecture />,
//             },
//           ],
//         },
//       ],
//     },
//   ]);

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return <RouterProvider router={appRouter} />;
// };

// function App() {
//   return (
//     <Provider store={store}>
//       <ErrorBoundary>
//         <AppContent />
//       </ErrorBoundary>
//     </Provider>
//   )
// }

// export default App


import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import { Provider } from "react-redux";
import store from "./app/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useLoadUserQuery } from "./features/api/authapi";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ui/ProtectedRoute";
import { lazy, Suspense } from "react";

// Lazy load components for code splitting and better performance
const Login = lazy(() => import("./Pages/Login"));
const HeroSection = lazy(() => import("./Pages/student/HeroSection"));
const MainLayout = lazy(() => import("./layout/MainLayout"));
const Courses = lazy(() => import("./Pages/student/Courses"));
const MyLearning = lazy(() => import("./Pages/student/MyLearning"));
const Profile = lazy(() => import("./Pages/student/Profile"));
const Sidebar = lazy(() => import("./Pages/admin/Sidebar"));
const Dashboard = lazy(() => import("./Pages/admin/Dashboard"));
const CourseTable = lazy(() => import("./Pages/admin/course/CourseTable"));
const AddCourse = lazy(() => import("./Pages/admin/course/AddCourse"));
const EditCourse = lazy(() => import("./Pages/admin/course/EditCourse"));
const CreateLecture = lazy(() => import("./Pages/admin/lecture/CreateLecture"));
const EditLecture = lazy(() => import("./Pages/admin/lecture/EditLecture"));
const CourseDetail = lazy(() => import("./Pages/student/CourseDetail"));
const SearchPage = lazy(() => import("./Pages/SearchPage"));

const AppContent = () => {
  const { isLoading } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <HeroSection />
              <Courses />
            </Suspense>
          ),
        },
        {
          path: "login",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <AuthenticatedUser>
                <Login />
              </AuthenticatedUser>
            </Suspense>
          ),
        },
        {
          path: "my-learning",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <MyLearning />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "profile",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "course/search",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "course-detail/:courseId",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            </Suspense>
          ),
        },

        // ADMIN ROUTES
        {
          path: "admin",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <AdminRoute>
                <Sidebar />
              </AdminRoute>
            </Suspense>
          ),
          children: [
            { 
              path: "dashboard", 
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <Dashboard />
                </Suspense>
              ) 
            },
            { 
              path: "course", 
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <CourseTable />
                </Suspense>
              ) 
            },
            { 
              path: "course/create", 
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <AddCourse />
                </Suspense>
              ) 
            },
            { 
              path: "course/:courseId", 
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <EditCourse />
                </Suspense>
              ) 
            },
            { 
              path: "course/:courseId/lecture", 
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <CreateLecture />
                </Suspense>
              ) 
            },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <EditLecture />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
