import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";


const PORT = 4000;
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});




let users = [];

io.on("connection", (socket) => {
  console.log("user connected");
  
  

 
  // when user joins
    socket.on("join",({name,room},callback)=>{
   
      name = name.trim().toLowerCase();
      room = room.trim().toLowerCase();
  
      const existingUser = users.find((user)=>user.room === room && user.name === name);
      if(!name || !room){
        return callback({error:"Username and room are required"});
      }
      if(existingUser){
        return callback({error:"Username is taken"});
      }
      
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

 



  socket.on("sendMessage", (message, callback) => {
    // const user = users.find((user) => user.id === socket.id);
    // console.log(user);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    // const user = users.pop((user) => user.id === socket.id);
    const userr = users.findIndex((user) => user.id === socket.id);
  
    if(userr !== -1){
      users.splice(userr,1);
    }
    

    if(users){

      io.to(users.room).emit("message",{user:"admin",text:`${users.name} has left`});
      io.to(users.room).emit('roomData',{room:users.room,users:users.filter((userr)=>userr.room === users.room)});
      
    }
    console.log(`${socket.id} disconnected`);
    
  });
});

app.use(express.json());
app.use(cors());

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});