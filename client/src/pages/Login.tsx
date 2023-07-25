import { FormEvent, useRef } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const { login, user } = useAuth();

    if (user) <Navigate to='/' />;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const id = usernameRef.current?.value;

        if (login.isLoading || !id) return;

        login.mutate({ id });
    }

    return (
        <>
            <h1 className='text-3xl font-bold mb-8 text-center'>Login</h1>
            <form
                onSubmit={handleSubmit}
                className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end'
            >
                <label htmlFor='username'>Username</label>
                <Input id='username' pattern='\S*' required ref={usernameRef} />
                <Button
                    disabled={login.isLoading}
                    type='submit'
                    className='col-span-full'
                >
                    {login.isLoading ? 'Loading...' : 'Login'}
                </Button>
            </form>
        </>
    );
};

export default Login;
