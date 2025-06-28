import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyNotes from './pages/MyNotes';
import ProtectedRoute from './components/ProtectedRoute';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/mynotes',
        element: (
          <ProtectedRoute>
            <MyNotes />
          </ProtectedRoute>
        ),
      },
      {
        path: '/forgetPassword',
        element: <ForgetPassword />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />,
      },
    ],
  },
]);

export default router;