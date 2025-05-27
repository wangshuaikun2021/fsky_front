import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import DiaryList from '../pages/diary/DiaryList';
import DiaryEdit from '../pages/diary/DiaryEdit';
import PhotoWall from '../pages/photo/PhotoWall';
import MusicList from '../pages/music/MusicList';
import MoodRecord from '../pages/mood/MoodRecord';
import Anniversary from '../pages/anniversary/Anniversary';
import BindPartner from '../pages/partner/BindPartner';
import PrivateRoute from '../components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <PrivateRoute><MainLayout /></PrivateRoute>,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'partner',
        element: <BindPartner />,
      },
      {
        path: 'diary',
        children: [
          {
            path: 'list',
            element: <DiaryList />,
          },
          {
            path: 'edit/:id?',
            element: <DiaryEdit />,
          },
        ],
      },
      {
        path: 'photo',
        element: <PhotoWall />,
      },
      {
        path: 'music',
        element: <MusicList />,
      },
      {
        path: 'mood',
        element: <MoodRecord />,
      },
      {
        path: 'anniversary',
        element: <Anniversary />,
      },
    ],
  },
]);

export default router; 