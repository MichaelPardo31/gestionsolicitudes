import React, { useState } from 'react';
import ChatbotAssistant from './ChatbotAssistant';
import styles from './ChatbotFloat.module.css';

const ChatbotFloat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatbotFloatingContainer}>
      {isOpen && (
        <div className={styles.chatbotModal}>
          <div className={styles.chatbotHeader}>
            <h3>Asistente Virtual</h3>
            <button 
              className={styles.closeButton} 
              onClick={toggleChatbot}
            >
              ×
            </button>
          </div>
          <div className={styles.chatbotContent}>
            <ChatbotAssistant />
          </div>
        </div>
      )}
      
      <div 
        className={styles.chatbotBubble} 
        onClick={toggleChatbot}
        title="Asistente Virtual"
      >
        🤖
      </div>
    </div>
  );
};

export default ChatbotFloat;
