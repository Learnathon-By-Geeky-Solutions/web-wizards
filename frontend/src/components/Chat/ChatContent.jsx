import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import EmptyState from './EmptyState';

const ChatContent = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.sender === 'user'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};
ChatContent.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default ChatContent;