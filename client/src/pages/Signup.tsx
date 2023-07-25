import { FormEvent, useRef } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const imageUrlRef = useRef<HTMLInputElement>(null);
    const { signup } = useAuth();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const id = usernameRef.current?.value;
        const name = nameRef.current?.value;
        const image = imageUrlRef.current?.value;

        if (signup.isLoading || !id || !name) return;

        signup.mutate({ id, name, image });
    }

    return (
        <>
            <h1 className='text-3xl font-bold mb-8 text-center'>Sign Up</h1>
            <form
                onSubmit={handleSubmit}
                className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end'
            >
                <label htmlFor='username'>Username</label>
                <Input id='username' pattern='\S*' required ref={usernameRef} />
                <label htmlFor='name'>Name</label>
                <Input id='name' required ref={nameRef} />
                <label htmlFor='imageUrl'>Image Url</label>
                <Input id='imageUrl' type='url' ref={imageUrlRef} />
                <Button
                    disabled={signup.isLoading}
                    type='submit'
                    className='col-span-full'
                >
                    {signup.isLoading ? 'Loading...' : 'Sign Up'}
                </Button>
            </form>
        </>
    );
};

export default Signup;
