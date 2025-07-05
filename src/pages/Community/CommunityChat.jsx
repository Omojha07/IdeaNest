import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';

const socket = io('http://localhost:3000');

export default function CommunityChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Fetch messages from the API and add an isSender flag
  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = await getToken();
        const response = await axios.get(
          'http://localhost:3000/api/chat/messages',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const messagesWithIsSender = response.data.map(msg => ({
          ...msg,
          isSender: msg.sender && msg.sender._id === user.id,
        }));
        setMessages(messagesWithIsSender);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    if (isLoaded && user) {
      fetchMessages();
    }
  }, [isLoaded, user, getToken]);

  // Listen for new messages via socket and add the isSender flag
  useEffect(() => {
    if (!isLoaded || !user) return;

    const handleChatMessage = msg => {
      const newMsg = {
        ...msg,
        isSender: msg.senderId === user.id,
      };
      setMessages(prev => [...prev, newMsg]);
    };

    socket.on('chat message', handleChatMessage);
    return () => socket.off('chat message', handleChatMessage);
  }, [isLoaded, user]);

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!isLoaded || !user) return;

    const msgObj = {
      senderId: user.id,
      message: message.trim(),
    };

    socket.emit('chat message', msgObj);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-300 pl-[10%]">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-opacity-50 rounded-xl backdrop-blur-md">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
              <div className="w-fit flex items-start space-x-3">
                {/* Avatar for Receiver (Shown for non-sender messages) */}
                {!msg.isSender && (
                  <img
                    src={msg.sender?.avatar || '/default-avatar.png'}
                    alt={msg.sender?.name || 'Unknown'}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm"
                  />
                )}
        
                {/* Message Content */}
                <div
                  className={`p-3 rounded-xl shadow-md ${
                    msg.isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-zinc-100 text-black rounded-tl-none'
                  }`}
                >
                  {/* Sender Info - Name & Email */}
                  {!msg.isSender && msg.sender && (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-amber-500">{msg.sender.name}</h3>
                        <span className="text-xs text-gray-500">{msg.sender.email}</span>
                      </div>
                    </div>
                  )}
        
                  {/* Actual Message */}
                  <p className="text-sm mt-1">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </main>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 mr-[10%]">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          <button
            type="submit"
            className="px-2 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition focus:outline-none"
          >
            <Send className="p-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
