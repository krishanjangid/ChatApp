import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

let socket;
const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
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
    console.log(socket.id);

    return () => {
      socket.on("disconnect");
      socket.off();
    };
  }, [location.search, messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
      console.log(socket.id);
    }
  };

  const handleQuitRoom = () => {
    socket.disconnect();
    navigate("/");
  };

  const trimmedName = name.trim();
  return (
    <div className=" flex flex-col md:flex-row lg:flex-row drop-shadow-lg h-screen bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900">
      <h1 className="m-auto md:text-3xl lg:text-5xl sm:text-sm hidden md:block lg:block  backdrop-blur-lg font-extrabold text-white opacity-70">
        Live Chat Room
      </h1>
      <div className=" relative h-full w-full md:w-1/3  lg:w-1/3 md:h-5/6 lg:h-5/6 bg-white  shadow-lg   m-auto rounded-none md:rounded-3xl lg:rounded-3xl   items-center">
        <div className="h-14 sm:w-full md:w-auto lg:w-auto flex justify-between p-3 lg:text-base rounded-none md:rounded-t-3xl lg:rounded-t-3xl items-center  shadow-lg shadow-neutral-950/10 z-50 opacity-100 bg-gradient-to-r from-blue-500 to-purple-600">
          <h1 className="lg:text-2xl md:text-lg  font-bold text-white opacity-90">
            Chat Room : {room}
            <br />
            <span className="text-xs absolute mt-[-5px] ">
              Name: {trimmedName}
            </span>
          </h1>

          <div className="flex items-center gap-3 p-5">
            <marquee className="lg:w-30 md:w-30 sm:w-30 h-10" direction="up">
              <h1>
                {Array.from(users)?.map((u) => {
                  return (
                    <p className="text-white text-lg font-bold">{u.name}</p>
                  );
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
            <Tooltip
              title="Signout"
              className="float-right"
              onClick={handleQuitRoom}
            >
              <IconButton>
                <MdLogout className="text-white" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="w-full absolute container ">
          <div className="relative">
            <Messages messages={messages} name={name} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

export const Messages = ({ messages, name }) => {
  return (
    <div className="relative flex flex-col   min-h-[530px]  max-h-[530px] lg:h-[26rem] md:h-[26rem] overflow-auto p-1  ">
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
      <div class="bg-gradient-to-br from-blue-600 to-purple-300   p-3 mb-5 rounded-l-lg rounded-br-lg">
        <p class="text-md text-white">{text}</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-start">
      <div>
        <div class="bg-gradient-to-br from-purple-300  to-blue-600 p-3 rounded-r-lg rounded-bl-lg">
          <p class="text-sm text-white">{text}</p>
        </div>
        <span class="text-xs text-slate-950 leading-none">{user}</span>
      </div>
    </div>
  );
};

export const Input = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="relative">
    <form className=" sticky gap-5 mt-2 py-2 ml-5 mr-5 px-2 flex justify-around items-center drop-shadow-lg border-2   rounded-full bg-white">
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
        onClick={(e) => sendMessage(e)}
      >
        Send
      </button>
    </form>
    </div>
  );
};
