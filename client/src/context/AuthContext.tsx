import { UseMutationResult, useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { ReactNode, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextI {
    signup: UseMutationResult<AxiosResponse, unknown, UserI>;
    login: UseMutationResult<AxiosResponse, unknown, { id: string }>;
}

export interface UserI {
    id: string;
    name: string;
    image?: string;
}

const Context = createContext<AuthContextI | null>(null);

export function useAuth() {
    return useContext(Context) as AuthContextI;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();

    const signup = useMutation({
        mutationFn: (user: UserI) => {
            return axios.post(
                `${import.meta.env.VITE_SERVER_URL}/signup`,
                user
            );
        },
        onSuccess() {
            navigate('/login');
        },
        onError(e) {
            alert(e);
        },
    });

    const login = useMutation({
        mutationFn: ({ id }: { id: string }) => {
            return axios
                .post(`${import.meta.env.VITE_SERVER_URL}/login`, {
                    id,
                })
                .then((res) => res.data as { token: string; user: UserI });
        },
        onSuccess() {
            navigate('/login');
        },
        onError(e) {
            alert(e);
        },
    });

    return (
        <Context.Provider value={{ signup, login }}>
            {children}
        </Context.Provider>
    );
}
