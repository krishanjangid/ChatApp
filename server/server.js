import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";


const PORT = 4000;
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.6:5173/",
  },
});




let users = [];

io.on("connection", (socket) => {
  console.log("user connected");
 
  // when user joins
    socket.on("join",({name,room},callback)=>{
      
      name = name.trim().toLowerCase();
      room = room.trim().toLowerCase();
      
      if(!name || !room){
        return callback("Please enter a valid name and room");
      }
      // const existingUser = users.find((user)=>user.name === name && user.room === room);
      // if(existingUser){
      //   return callback("Username already taken");
      // }

      const user = {id:socket.id,name,room};
      users.push(user);
      
      
      socket.join(user.room);
      
      socket.emit('username',user.name);

      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

      io.to(user.room).emit('roomData', { users: users.filter((item)=>item.room === user.room)});
      console.log(users);
      
      callback();
  
    });  

 


    // when user sends message
  socket.on("sendMessage", (message, callback) => {
    try{
      console.log(socket.id);
      console.log(users.find((person)=>person.id === socket.id));
      const user = users.find((person)=>person.id === socket.id);
      const {name,room} = user;
      console.log("name: "+name);
      console.log("room: "+room);
      console.log(message);
      io.to(room).emit("message", { user:name, text: message });
      callback();
    }
    catch(err){
      console.log(err);
    }
  });

  const lefftedUser = []; 

socket.on("disconnect", () => {
  const userr = users.findIndex((user) => user.id === socket.id);

  if (userr !== -1) {
    const leftUser = users.splice(userr, 1);
    lefftedUser.push(leftUser[0].name);
    io.to(leftUser[0].room).emit("message", {user: "admin", text: `${leftUser[0].name} has left.`});
    
  }
  const user = users.find((user) => user.id === socket.id);
  console.log(lefftedUser);
  if(user){
    io.to(user.room).emit('roomData', {room: user.room, users: users.filter((item)=>item.room === user.room)});
  }

  console.log(`${socket.id} disconnected`);
});

});

app.use(express.json());
app.use(cors());

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});