import {
    Channel,
    ChannelHeader,
    ChannelList,
    ChannelListMessengerProps,
    Chat,
    LoadingIndicator,
    MessageInput,
    MessageList,
    Window,
    useChatContext,
} from 'stream-chat-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

function Channels({ loadedChannels }: ChannelListMessengerProps) {
    const { setActiveChannel, channel: activeChannel } = useChatContext();
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className='w-60 flex flex-col gap-4 m-3 h-full'>
            <Button onClick={() => navigate('/channel/new')}>
                New Conversation
            </Button>
            <hr className='border-gray-500' />
            {loadedChannels && loadedChannels?.length > 0
                ? loadedChannels.map((channel) => {
                      const isActive = channel === activeChannel;
                      const extraClasses = isActive
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-blue-500 bg-gray-100';

                      return (
                          <button
                              onClick={() => setActiveChannel(channel)}
                              disabled={isActive}
                              className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
                              key={channel.id}
                          >
                              {/* {channel.data?.image && (
                                  <img
                                      src={channel.data.image}
                                      className='w-10 h-10 rounded-full object-center obiect-cover'
                                  />
                              )} */}
                              <div className='text-ellipsis overflow-hidden object-cover'>
                                  {channel.data?.name || channel.id}
                              </div>
                          </button>
                      );
                  })
                : 'No conversations'}
            <hr className='border-gray-500' />
            <Button onClick={() => logout.mutate()} disabled={logout.isLoading}>
                Logout
            </Button>
        </div>
    );
}

const Home = () => {
    const { user, streamChat } = useAuth();
    const id = user?.id as string;

    if (streamChat == null) return <LoadingIndicator />;
    return (
        <Chat client={streamChat}>
            <ChannelList List={Channels} sendChannelsToList />
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
