import { Outlet, createBrowserRouter } from 'react-router-dom';
import AuthLayout from './pages/layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
    {
        element: <ContextProvider />,
        children: [
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
