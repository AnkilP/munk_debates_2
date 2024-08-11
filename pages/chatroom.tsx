// pages/chatroom.tsx
import Chat from '../components/chat';

const ChatroomPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Chatroom</h1>
      <Chat />
    </div>
  );
};

export default ChatroomPage;
