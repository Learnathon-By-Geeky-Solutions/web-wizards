import React from 'react';
import PropTypes from 'prop-types';
import ProfileDropdown from './ProfileDropdown';

const ChatHeader = ({ user }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        <p className="text-sm text-gray-500">Connect with healthcare providers</p>
      </div>
      <ProfileDropdown user={user} />
    </div>
  );
};
ChatHeader.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ChatHeader;