import { Outlet, createBrowserRouter } from 'react-router-dom';
import AuthLayout from './pages/layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './pages/layouts/RootLayout';
import Home from './pages/Home';

const router = createBrowserRouter([
    {
        element: <ContextProvider />,
        children: [
            {
                path: '/',
                element: <RootLayout />,
                children: [
                    { index: true, element: <Home /> },
                    {
                        path: '/channel',
                        children: [{ path: 'new', element: <h1>new</h1> }],
                    },
                ],
            },
            {
                element: <AuthLayout />,
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'signup', element: <Signup /> },
                ],
            },
        ],
    },
]);

function ContextProvider() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}

export default router;
