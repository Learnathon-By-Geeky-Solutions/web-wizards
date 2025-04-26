import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContextDefinition';
import MainLayout from '../layouts/MainLayout';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatContent from '../components/Chat/ChatContent';
import MessageInput from '../components/Chat/MessageInput';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [isLoading] = useState(false);
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
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 flex flex-col h-full">
        <ChatHeader user={user} />
        
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <ChatContent messages={messages} currentUser={user} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;