import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import cookie from 'cookie'; // npm install cookie if not done already

let io; // Declare io globally
const setupSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL, // or your frontend domain
      credentials: true, // IMPORTANT: allow credentials (cookies)
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error('No cookies sent'));

      const parsed = cookie.parse(cookies);
      const token = parsed.accessToken; // Assuming your token is in 'accessToken' cookie

      if (!token) return next(new Error('No token found'));

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    // join user's personal notification room
    socket.on("joinNotifications", (userId) => {
      socket.join(`notif:${userId}`);
      console.log(`User ${userId} joined notif room`);
    });
  });


    // join a conversation
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      //console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    // leave a conversation
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
      //console.log(`User ${socket.user._id} left room ${conversationId}`);
    });

    socket.on('send_message', ({ conversationId, message }) => {
      const fullMessage = {
        sender: socket.user._id,
        text: message,
        createdAt: new Date(),
      };

      // Emit to all others in the conversation room
      socket.to(conversationId).emit('receive_message', fullMessage);

    });

    socket.on('disconnect', () => {
      //console.log('Socket disconnected:', socket.id);
    });
  });
};

export { io }

export default setupSocket;
