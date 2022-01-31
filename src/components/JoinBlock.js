import React from 'react';
import socket from '../socket';
import axios from 'axios';

const JoinBlock = ({ onChat, user, onSubmit, addMessages }) => {
  const handlerSend = async () => {
    if (!user.roomId || !user.username) return;
    const { data: messages } = await axios.post('/rooms', user);
    addMessages(messages);
    await socket.emit('ROOM:JOIN', user);
    onChat();
  };

  return (
    <div className='join-block'>
      <input
        name='roomId'
        type='text'
        placeholder='Room ID'
        value={user.roomId}
        onChange={onSubmit}
      />
      <input
        name='username'
        type='text'
        placeholder='Your name'
        value={user.username}
        onChange={onSubmit}
      />
      <button onClick={handlerSend}>Come in</button>
    </div>
  );
};

export default JoinBlock;
