import React from 'react';
import PropTypes from 'prop-types';
import { PlusIcon, CalendarIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ 
  message, 
  icon = "plus", 
  title = "", 
  actionText = "", 
  onAction = null, 
  bgColor = "bg-teal-100", 
  iconColor = "text-teal-400" 
}) => {
  const renderIcon = () => {
    switch(icon) {
      case 'calendar':
        return <CalendarIcon className="h-12 w-12" />;
      case 'chat':
        return <ChatBubbleOvalLeftIcon className="h-12 w-12" />;
      case 'plus':
      default:
        return (
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16M4 12h16" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className={`w-32 h-32 ${bgColor} rounded-full flex items-center justify-center mb-4`}>
        <span className={iconColor}>{renderIcon()}</span>
      </div>
      {title && <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>}
      <p className="text-gray-500 text-lg">{message}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(['plus', 'calendar', 'chat']),
  title: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  bgColor: PropTypes.string,
  iconColor: PropTypes.string
};

export default EmptyState;