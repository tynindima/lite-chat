import React, { useState, useEffect, useCallback } from 'react';
import Chat from './components/Chat';
import JoinBlock from './components/JoinBlock';
import socket from './socket';
import './App.css';

function App() {
  const [isChat, setIsChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState({ roomId: '', username: '' });

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveUsers = (users) => {
    setUsers(users);
  };

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const addMessages = useCallback((messages) => {
    setMessages(messages);
  }, []);

  useEffect(() => {
    socket.on('ROOM:JOINED', saveUsers);
    socket.on('ROOM:SET_USERS', saveUsers);
    socket.on('ROOM:ADD_MESSAGE', addMessage);
  }, []);

  const handleOnChat = () => {
    setIsChat(true);
  };

  return (
    <div className='wrapper'>
      {isChat ? (
        <Chat users={users} messages={messages} data={data} />
      ) : (
        <JoinBlock
          user={data}
          onSubmit={handlerChange}
          addMessages={addMessages}
          onChat={handleOnChat}
        />
      )}
    </div>
  );
}

export default App;
