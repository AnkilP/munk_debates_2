import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

interface Message {
  user: string;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [user, setUser] = useState<string>('');

  useEffect(() => {
    const username = prompt('Enter your username') || 'Anonymous';
    setUser(username);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, []);

  const sendMessage = async () => {
    if (input.trim() !== '') {
      await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, user }),
      });

      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 ${message.user === user ? 'text-right' : 'text-left'}`}>
            <span className="font-semibold">{message.user}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t">
        <input
          type="text"
          className="flex-1 border rounded p-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
