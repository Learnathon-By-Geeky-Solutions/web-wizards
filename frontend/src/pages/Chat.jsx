import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatContent from '../components/Chat/ChatContent';
import MessageInput from '../components/Chat/MessageInput';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const handleSendMessage = (message) => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        read: true
      };
      setMessages([...messages, newMessage]);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 flex flex-col">
        <ChatHeader user={user} />
        
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <ChatContent messages={messages} currentUser={user} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;