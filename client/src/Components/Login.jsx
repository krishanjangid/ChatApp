import React, { useEffect, useState } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isemail, setisemail] = useState(false);
  const [ispassword, setispassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "email") {
      if (value === "") {
        setisemail(false);
      } else {
        setisemail(true);
      }
    }
    if (name === "password") {
      if (value === "") {
        setispassword(false);
      } else {
        setispassword(true);
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/join");
    }
  }, [localStorage.getItem("user")]);

  const googleAuthHandler = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const authtime = performance.now();
    console.log("time taken bt google auth:  " + authtime);
    //sucess toast
    console.log(user);
    toast("Logged In.. 😁", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    if (user) {
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/join");
      }, 4000);
    }
  };

   const  handleSubmit  = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email) {
        setValidationError("Email is required");
      } else if (!formData.password) {
        setValidationError("Password is required");
      } else {
        setValidationError("");
        const finalfromData = new FormData();
        finalfromData.append("email", formData.email);
        finalfromData.append("password", formData.password);
        setLoading(true);
        const response = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = response.user;
        setLoading(false);
        if (!response.user) {
          setValidationError("Invalid Email or Password");
        }
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/join");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setValidationError(error.response.data.message);
      }
    }
  }

  console.log(formData);
  return (
    <>
      {/* <div className="Container h-screen flex items-center bg-current">

      <div className="card ">
      <form onSubmit={handleSubmit} className="my-form">
  
  <div className="form-group">
    <label htmlFor="email">Email:</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Example@gmail.com"
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label htmlFor="password">Password:</label>
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Password"
      className="form-input"
    />
  </div>
  <div className="form-group">
    <button type="submit" className="rounded-lg hover:bg-slate-800  bg-black text-white p-2 text-lg">Submit</button>
  </div>
</form>
      </div>
      {validationError && (
        <div className="alert">
          <p>{validationError}</p>
        </div>
      )}
      </div> */}
      <section
        className={
          loading
            ? "h-full md:h-screen lg:h-screen bg-neutral-200 dark:bg-neutral-700 opacity-30"
            : "h-full md:h-screen lg:h-screen bg-neutral-200 dark:bg-neutral-700"
        }
      >
        <div className="container h-full p-10">
          <div className="flex h-full  flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full min-w-md  max-w-[60rem] ">
              <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                <div className="lg:flex lg:flex-wrap">
                  {/* left coulmn side start */}
                  <div className="px-4 md:px-0 lg:w-6/12">
                    <div className="md:mx-6 md:p-12">
                      {/* logo */}
                      <div className="text-center">
                        <img className="mx-auto  w-28" src={logo} alt="logo" />
                        <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                          Welcome to Live Chat
                        </h4>
                      </div>

                      {/* login form */}
                      <form onSubmit={handleSubmit} >
                        <p className="mb-4">Please login to your account</p>

                        <div
                          className="relative mb-4"
                          data-te-input-wrapper-init
                        >
                          <input
                            type="email"
                            name="email"
                            className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-liner focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Example@gmail.com"
                          />

                          <label
                            htmlFor="email"
                            className={
                              isemail
                                ? "hidden"
                                : "pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500  transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            }
                          >
                            Email
                          </label>
                        </div>

                        <div
                          className="relative mb-4"
                          data-te-input-wrapper-init
                        >
                          <input
                            type="password"
                            name="password"
                            className="peer border-2 block min-h-[auto] w-full rounded  bg-transparent px-3 py-[0.1rem] leading-[1.8] outline-none transition-all duration-200 ease-liner focus:placeholder:opacity-10 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                          />

                          <label
                            htmlFor="password"
                            className={
                              ispassword
                                ? "hidden"
                                : "pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%]  truncate pt-[0.1rem] leading-[1.8] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            }
                          >
                            Password
                          </label>
                        </div>

                        {/* submit button */}

                        <div className="mb-12 pb-1 pt-1 text-center">
                          <button
                            className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] bg-gradient-to-r from-sky-400 to-indigo-900"
                            type="submit"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                          >
                            Log in
                          </button>
                     
                          
                          <button
                            className="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
                            onClick={googleAuthHandler}
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 48 48"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_17_40)">
                                <path
                                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                                  fill="#4285F4"
                                />
                                <path
                                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                                  fill="#34A853"
                                />
                                <path
                                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                                  fill="#FBBC04"
                                />
                                <path
                                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                                  fill="#EA4335"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_17_40">
                                  <rect width="48" height="48" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            Continue with Google
                          </button>
                        </div>

                        <div className="flex items-center justify-between pb-6">
                          <p className="mb-0 mr-2">Don't have an account?</p>
                          <Link to="/signup">
                            <button
                              type="button"
                              className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                            >
                              Register
                            </button>
                          </Link>
                        </div>
                      </form>
                      <ToastContainer
                        position="bottom-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                      />
                    </div>
                    {validationError && (
                      <div className="alert">
                        <p>{validationError}</p>
                      </div>
                    )}
                  </div>
                  {/* left coulmn side end */}
                  {/* right coulmn side start */}
                  <div className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none bg-gradient-to-r  from-sky-400 to-indigo-900">
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <h4 className="mb-6 text-xl font-semibold">
                        We are an Live Chat Application
                      </h4>
                      <p className="text-sm">
                        this is a live chat application where you can chat with
                        your friends and family. you can join diffrent room and
                        chat with them. you can also create your own room and
                        invite your friends and family to join your room and
                        chat with them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
