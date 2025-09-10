import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from 'react';
import authContext from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import swal from "sweetalert";

const schema = yup.object().shape({
  email: yup.string()
    .required("This field is required")
    .email("Enter a valid email"),
  password: yup.string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters")
});

function LoginForm() {
  const navigate = useNavigate();

  const AuthContext = useContext(authContext);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onFormSubmit = (data) => {
    console.log(data);
    
    fetch(`https://api.benben.pics/accounts/jwt/access/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password })
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(({ status, body }) => {
      if(status === 200) {
        AuthContext.login(body.access);
        swal({
          title: "  Logged in successfully",
          buttons: "Go to homepage",
          icon: "success",
        }).then(() => {
          navigate("/")
        })
        
      } else {
        swal({
          title: "Incorrect information",
          buttons: "OK",
          icon: "error",
        });
      }
      console.log(body);
    });

    console.log(AuthContext);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-md bg-white rounded-lg font-MorabbaBold shadow-md p-10 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Login</h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-sm text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email")}
          />
          <p className='text-red-500 mt-1.5'>{errors.email?.message}</p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 text-sm text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password")}
          />
          <p className='text-red-500 mt-1.5'>{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <Link to={"/register"}>
            <span className='font-MorabbaBold'>
              Don't have an account? <span className='text-blue-500'>Register here</span>
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
