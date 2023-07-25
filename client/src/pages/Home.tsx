import {
    Channel,
    ChannelHeader,
    ChannelList,
    Chat,
    LoadingIndicator,
    MessageInput,
    MessageList,
    Window,
} from 'stream-chat-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, streamChat } = useAuth();

    if (streamChat == null) return <LoadingIndicator />;
    return (
        <Chat client={streamChat}>
            <ChannelList />
            <Channel>
                <Window>
                    <ChannelHeader></ChannelHeader>
                    <MessageList></MessageList>
                    <MessageInput></MessageInput>
                </Window>
            </Channel>
        </Chat>
    );
};

export default Home;
