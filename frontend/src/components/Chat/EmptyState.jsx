import React from 'react';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <ChatBubbleOvalLeftIcon className="h-12 w-12 text-teal-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
      <p className="text-gray-500 max-w-xs">
        Start a conversation with healthcare providers using the message box below
      </p>
    </div>
  );
};

export default EmptyState;