import React from 'react';
import '../../styles/Gameplay.css';

interface MessageProps {
  children: React.ReactNode;
  type: 'success' | 'encouraging';
}

const Message: React.FC<MessageProps> = ({ children, type }) => {
  const messageClass = type === 'success' ? 'success-message' : 'encouraging-message';
  
  return (
    <div className={`message-container ${messageClass}`}>
      {children}
    </div>
  );
};

export default Message;
