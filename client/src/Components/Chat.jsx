import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import queryString from "query-string";
import { useLocation } from "react-router-dom";



let socket;
const Chat = () => {
  const [data, setData] = useState([]);
  const [chatRoom, setChatRoom] = useState("1");
  const [userName, setUserName] = useState(["krishan Jangid", "Paras Sharma"]);
  const [userData, setUserData] = useState({
    name: "",
  });

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const location = useLocation();

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io("http://localhost:4000");
    setRoom(room);
    setName(name);
    console.log(socket);

    socket.emit("join", { name, room }, (response) => {
      console.log(response);
    });
    
    
   
    
  
  }, [location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("response", (response) => {
      setData([...data, response]);
    });
  },[]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  return (
    <div className="flex flex-col md:flex-row lg:flex-row drop-shadow-lg h-screen bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900">
      <h1 className="m-auto md:text-3xl lg:text-5xl sm:text-sm  backdrop-blur-lg font-extrabold text-white opacity-70">
        Live Chat Room
      </h1>
      <div className=" h-5/6 w-full md:w-1/3  lg:w-1/3  bg-white bg-opacity-30 shadow-lg   m-auto rounded-3xl  items-center">
        <div className="h-14 sm:w-full md:w-auto lg:w-auto flex justify-between p-2 lg:text-base  rounded-t-3xl items-center opacity-100 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
          <h1 className="lg:text-2xl md:text-lg  font-bold text-white opacity-90">
            Chat Room : {room}
          </h1>
          <div className="flex items-center gap-3 p-5">
            <marquee className="lg:w-30 md:w-30 sm:w-30 h-10" direction="up">
              <h1>
                {Array.from(users)?.map((u) => {
                  return <p className="text-white text-lg font-bold">{u.name}</p>;
                })}
              </h1>
            </marquee>
            <span className=" item-center mb-3 ">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                variant="dot"
              ></StyledBadge>
            </span>
          </div>
        </div>

        {data.map((i) => {
          return <h2>{i.name}</h2>;
        })}

        <div className="w-full h-60">
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;

export const Messages = ({ messages, name }) => {

  return (
    <div className="flex flex-col h-[460px]">
      {messages.map((message, i) => (
        <Message key={i} message={message} name={name} />
      ))}
    </div>
  );
};

export const Message = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    <div className="flex flex-col items-end">
      <p className="pr-3">{trimmedName}</p>
      <div className="flex flex-col items-end">
        <div className="flex flex-col items-end">
          <p className="pr-3">{text}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-start">
      <p className="pl-3">{user}</p>
      <div className="flex flex-col items-start">
        <div className="flex flex-col items-start">
          <p className="pl-3">{text}</p>
        </div>
      </div>
    </div>
  );
};

export const Input = ({ message, setMessage, sendMessage }) => {
  
 
  return (
    <form className="gap-5 mt-2 py-2 ml-5 mr-5 px-2 flex justify-around items-center drop-shadow-lg border-2   rounded-full bg-slate-100">
      <input
        className="border-2 border-gray-300  p-2  rounded-full w-3/4 focus:outline-slate-300  "
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4  h-10 rounded-3xl "
        onClick={(e) => sendMessage(e) }
        
      >Send</button>
    </form>
  );
};
