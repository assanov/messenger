import { ReactNode } from 'react';

interface FullScreenCardProps {
    children: ReactNode;
}

const FullScreenCard = ({ children }: FullScreenCardProps) => {
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='max-w-md w-full'>{children}</div>
        </div>
    );
};

FullScreenCard.Body = ({ children }: FullScreenCardProps) => {
    return <div className='shadow bg-white p-6 rounded-lg'>{children}</div>;
};

FullScreenCard.BelowCard = ({ children }: FullScreenCardProps) => {
    return <div className='mt2 justify-center flex gap-3'>{children}</div>;
};

export default FullScreenCard;
