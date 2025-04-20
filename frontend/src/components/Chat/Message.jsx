import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-teal-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p
          className={`text-xs mt-1 text-right ${
            isOwnMessage ? 'text-teal-100' : 'text-gray-500'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};
Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
};

export default Message;