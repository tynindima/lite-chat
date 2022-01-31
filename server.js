const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const port = 4000;

const rooms = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/rooms', (req, res) => {
  res.json({});
});

app.post('/rooms', (req, res) => {
  const { roomId, username } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }
  const messages = rooms.get(roomId).get('messages');
  res.json(messages);
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, username }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, username);
    const users = [...rooms.get(roomId).get('users').values()];
    io.in(roomId).emit('ROOM:JOINED', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, username, text }) => {
    if (roomId) {
      rooms.get(roomId).get('messages').push({ username, text });
      io.in(roomId).emit('ROOM:ADD_MESSAGE', { username, text });
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').has(socket.id)) {
        value.get('users').delete(socket.id);
        const users = [...value.get('users').values()];
        io.in(roomId).emit('ROOM:SET_USERS', users);
      }
    });
  });
});

httpServer.listen(port, () => {
  console.log(`This port localhost:${port} is work`);
});
