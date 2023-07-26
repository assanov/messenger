import { FormEvent, useRef } from 'react';
import Button from '../../components/Button';
import FullScreenCard from '../../components/FullScreenCard';
import Input from '../../components/Input';
import Link from '../../components/Link';
import { useMutation, useQuery } from '@tanstack/react-query';
import Select, { SelectInstance } from 'react-select';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewChannel = () => {
    const navigate = useNavigate();
    const { streamChat, user } = useAuth();
    const nameRef = useRef<HTMLInputElement>(null);
    const imageUrlRef = useRef<HTMLInputElement>(null);
    const memberIdsRef =
        useRef<SelectInstance<{ label: string; value: string }>>(null);
    const newChannel = useMutation({
        mutationFn: ({
            name,
            memberIds,
            imageUrl,
        }: {
            name: string;
            memberIds: string[];
            imageUrl: string | undefined;
        }) => {
            if (!streamChat) throw Error('not conencted');
            return streamChat
                .channel('messaging', crypto.randomUUID(), {
                    name,
                    members: [...memberIds],
                    imageUrl,
                })
                .create();
        },
        onSuccess: () => navigate('/'),
    });
    const users = useQuery({
        queryKey: ['stream', 'users'],
        queryFn: () => streamChat!.queryUsers({}, { name: 1 }),
        enabled: streamChat != null,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const name = nameRef.current?.value;
        const imageUrl = imageUrlRef.current?.value;
        const selectOptions = memberIdsRef.current?.getValue();

        if (!name || !selectOptions || !selectOptions.length) return;

        newChannel.mutate({
            name,
            imageUrl,
            memberIds: selectOptions.map((option) => option.value),
        });
    }
    return (
        <FullScreenCard>
            <FullScreenCard.Body>
                <h1 className='text-3xl font-bold mb-8 text-center'>
                    New Conversation
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end'
                >
                    <label htmlFor='username'>Name</label>
                    <Input id='name' pattern='\S*' required ref={nameRef} />
                    <label htmlFor='imageUrl'>Image Url</label>
                    <Input id='imageUrl' pattern='\S*' ref={imageUrlRef} />
                    <label htmlFor='members'>Members</label>
                    <Select
                        id='members'
                        required
                        isMulti
                        ref={memberIdsRef}
                        className='w-full'
                        isLoading={users.isLoading}
                        options={users.data?.users.map((user) => ({
                            value: user.id,
                            label: user.name,
                        }))}
                    />

                    <Button
                        disabled={newChannel.isLoading}
                        type='submit'
                        className='col-span-full'
                    >
                        {newChannel.isLoading ? 'Loading...' : 'Create'}
                    </Button>
                </form>
            </FullScreenCard.Body>
            <FullScreenCard.BelowCard>
                <Link to='/'>Back</Link>
            </FullScreenCard.BelowCard>
        </FullScreenCard>
    );
};

export default NewChannel;
