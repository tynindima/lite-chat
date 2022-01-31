import React, { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import Message from './Message';
import './Chat.css';

const Chat = ({ users, messages, data }) => {
  const [text, setText] = useState('');

  const messageEnd = useRef();

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.roomId && text !== '') {
      socket.emit('ROOM:NEW_MESSAGE', { ...data, text });
      setText('');
    }
  };

  return (
    <div className='chat'>
      <div className='chat-users'>
        <h3 className='chat-users__title'>{`Users (${users.length}):`}</h3>
        <ul className='chat-users__list'>
          {users.map((user, idx) => (
            <li key={idx} className='chat-users__user'>
              {user}
            </li>
          ))}
        </ul>
      </div>
      <div className='chat-messages'>
        <div className='messages'>
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} username={data.username} />
          ))}
          <div ref={messageEnd} />
        </div>
        <form onSubmit={handleSubmit} className='chat-form'>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='chat-form__text'
            rows={3}
          ></textarea>
          <button className='chat-btn' type='submit'>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
