import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from 'react';
import authContext from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import swal from "sweetalert";
import { Navigate } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string()
    .required("این فیلد الزامی است")
    .email("ایمیل معتبر وارد کنید"),
  password: yup.string()
    .required("این فیلد الزامی است")
    .min(6, "پسورد باید حداقل 6 کاراکتر باشد")
});

function LoginForm() {
  const navigate = useNavigate()

  const AuthContext = useContext(authContext)
  
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
          title: "با موفقیت لاگین شدید",
          buttons: "رفتن به صفحه اصلی",
          icon: "success",
        }).then(() => {
          navigate("/")
        })
        
      } else {
        swal({
          title: "اطلاعات اشتباه است",
          buttons: "باشه",
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
        <h2 className="text-2xl font-semibold text-gray-800 text-center">ورود</h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-sm text-gray-700">ایمیل</label>
          <input
            type="email"
            id="email"
            placeholder="email"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email")}
          />
          <p className='text-red-500 mt-1.5'>{errors.email?.message}</p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 text-sm text-gray-700">رمز عبور</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password")}
          />
          <p className='text-red-500 mt-1.5'>{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          ورود
        </button>

        <div className="text-center mt-4">
          <Link to={"/register"}>
          <span className='font-MorabbaBold'>حساب کاربری ندارید؟  <span className='text-blue-500'>ثبت نام  کنید</span></span>
            
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
