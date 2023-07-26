import { UseMutationResult, useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextI {
    user: UserI | undefined;
    streamChat: StreamChat | undefined;
    signup: UseMutationResult<AxiosResponse, unknown, UserI>;
    login: UseMutationResult<
        { token: string; user: UserI },
        unknown,
        { id: string }
    >;
    logout: UseMutationResult<AxiosResponse, unknown, void>;
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
    const [user, setUser] = useLocalStorage<UserI>('user');
    const [token, setToken] = useLocalStorage<string>('token');
    const [streamChat, setStreamChat] = useState<StreamChat>();

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
        onSuccess(data) {
            setUser(data.user);
            setToken(data.token);
        },
        onError(e) {
            alert(e);
        },
    });

    const logout = useMutation({
        mutationFn: () => {
            return axios.post(`${import.meta.env.VITE_SERVER_URL}/logout`, {
                token,
            });
        },
        onSuccess() {
            setUser(undefined);
            setToken(undefined);
        },
        onError(e) {
            alert(e);
        },
    });

    useEffect(() => {
        if (!token || !user) return;

        const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY!);
        if (chat.tokenManager.token === token && chat.userID === user.id)
            return;

        let isInterrupted = false;

        const connectPromise = chat.connectUser(user, token).then(() => {
            if (isInterrupted) return;
            setStreamChat(chat);
        });

        return () => {
            isInterrupted = true;
            setStreamChat(undefined);
            connectPromise.then(() => {
                chat.disconnectUser();
            });
        };
    }, [token, user]);

    return (
        <Context.Provider value={{ signup, login, logout, user, streamChat }}>
            {children}
        </Context.Provider>
    );
}
