import React from 'react';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useContext } from 'react';
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom';
import authContext from '../../context/authContext';
import { Link } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string()
    .required("This field is required") 
    .email("Enter a valid email"),

  password: yup.string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),

  confirmpassword: yup.string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});


function Register() {
  const navigate = useNavigate();
  const AuthContext = useContext(authContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onFormSubmit = (data) => {
    let newUserInfos = {
      email: data.email,
      password: data.password,
      password_conf: data.confirmpassword
    }

    fetch(`https://api.benben.pics/accounts/registration/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserInfos)
    })
    .then(res => {
      if(res.status === 201) {
        swal({
          title: " Registered successfully",
          buttons: "Go to login",
          icon: "success",
        }).then(() => {
          navigate("/login");
        })
      } else if(res.status === 400) {
        swal({
          title: "An account with this information already exists",
          buttons: "OK",
          icon: "error",
        })
      }
      return res.json();
    })
    .then(data => {
      console.log(AuthContext);
      console.log(data);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-md bg-white rounded-lg font-MorabbaBold shadow-md p-10 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Register</h2>

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

        <div className="flex flex-col">
          <label htmlFor="confirmpassword" className="mb-2 text-sm text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            placeholder="Confirm Password"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("confirmpassword")}
          />
          <p className='text-red-500 mt-1.5'>{errors.confirmpassword?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          Register
        </button>
        <div className='text-center mt-4'>
          <Link to={"/login"}>
            <span className='font-MorabbaBold'>
              Already have an account? <span className='text-blue-500'>Login here</span>
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
