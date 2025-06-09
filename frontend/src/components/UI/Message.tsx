import React from 'react';
import '../../styles/Gameplay.css';

interface MessageProps {
  children: React.ReactNode;
  type: 'success' | 'encouraging' | 'happiness';
}

const Message: React.FC<MessageProps> = ({ children, type }) => {
  const getMessageClass = () => {
    switch (type) {
      case 'success': return 'success-message';
      case 'encouraging': return 'encouraging-message';
      case 'happiness': return 'happiness-message';
      default: return 'encouraging-message';
    }
  };
  
  return (
    <div className={`message-container ${getMessageClass()}`}>
      {children}
    </div>
  );
};

export default Message;
