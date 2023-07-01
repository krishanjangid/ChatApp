import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      alert("Please Login First");
      navigate("/");
    }
  }, [localStorage.getItem("user")]);

  const handleSignout = () => {
    const logout = signOut(auth);
    if(logout) {
      console.log("Signout Successful");
        localStorage.removeItem("user");
        navigate("/");
    }
  };

  return (
    <div className=" flex flex-col md:flex-row lg:flex-row drop-shadow-lg h-screen bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900">
      <h1 className="m-auto md:text-3xl lg:text-5xl sm:text-sm backdrop-blur-lg font-extrabold text-white opacity-70">
        {" "}
        Join Live Chat Room
      </h1>

      <div className="  h-5/6 sm:w-1/2 md:w-1/3  lg:w-1/3  bg-white bg-opacity-10 shadow-lg p-10  m-auto rounded-3xl  items-center">
        <h1 className="text-3xl text-center  font-bold text-slate-50 mb-8">
          Join
          <Tooltip
            title="Signout"
            className="float-right"
            onClick={handleSignout}
          >
            <IconButton>
              <MdLogout className="text-white" />
            </IconButton>
          </Tooltip>
        </h1>

        <form className="flex flex-col space-y-4 gap-20  ">
          <input
            type="text"
            placeholder="Enter your name"
            className=" bg-transparent border-2 focus:border-cyan-100 focus:text-white text-white placeholder:text-white bg-opacity-50 p-5  rounded outline-none text-lg"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your room"
            className=" bg-transparent border-2 focus:border-cyan-100 focus:text-white text-white placeholder:text-white bg-opacity-50 p-5 rounded outline-none text-lg "
            onChange={(e) => setRoom(e.target.value)}
          />
          <Link
            onClick={(e) => (!name || !room ? e.preventDefault() : null)}
            to={`/chat/?name=${name}&room=${room}`}
          >
            <button className="ml-2 p-5 w-11/12 font-bold text-white  m-auto rounded-full text-2xl   bg-gray-100 bg-opacity-50 mt-16 hover:bg-slate-100 hover:text-black ">
              Join
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Join;
