import React from 'react';
import classNames from 'classnames';
import './Chat.css';

const Message = ({ msg, username }) => {
  const isGuest = username === msg.username;

  const messageClasses = classNames('message', { message_guest: isGuest });
  const textClasses = classNames('message__text', {
    message__text_guest: isGuest,
  });

  return (
    <div className={messageClasses}>
      <p className={textClasses}>{msg.text}</p>
      <div className='message__name-box'>
        <span className='message__name'>{msg.username}</span>
      </div>
    </div>
  );
};

export default Message;
