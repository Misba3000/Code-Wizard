const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const http = require("http");
const socketIo = require("socket.io"); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: {
  origin: "http://localhost:5173",  
  methods: ["GET", "POST"],
}});

// const rooms = {}; // Store users in rooms

// io.on("connection", (socket) => {
//     console.log("New user connected:", socket.id);

//     socket.on("join-room", (roomId, userId) => {
//       console.log("roomId : ",roomId);
//         if (!rooms[roomId]) {
//             rooms[roomId] = [];
//         }
//         rooms[roomId].push(userId);

//         socket.join(roomId);

//         socket.emit("existing-users", rooms[roomId].filter(id => id !== userId));
//         socket.broadcast.to(roomId).emit("user-connected", userId);

//         socket.on("disconnect", () => {
//             rooms[roomId] = rooms[roomId].filter(id => id !== userId);
//             socket.broadcast.to(roomId).emit("user-disconnected", userId);
//         });
//     });
// });

app.use(cors());
app.use(bodyParser.json());

const routes = require('./routes/routes');
app.use('/api/wizard', routes);

const PORT = 4001;

server.listen(PORT, () => {  // FIXED: Use `server.listen`
  console.log(`Server running at http://localhost:${PORT}`);
});