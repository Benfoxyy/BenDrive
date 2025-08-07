import React from 'react';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object().shape({
  email:  yup.string().email("ایمیل معتبر وارد کنید ").required() ,
  password : yup.string().min(6 , "پسورد باید 6 کاراکتر باشد ").required() ,
});


function LoginForm() {
  
  const { register , handleSubmit  , formState:{errors}} = useForm({resolver  : yupResolver(schema)})
  
  const onFormSubmit = (data) => {
    console.log("the form is submit");
    console.log(data);
    
    
    
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form  onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-md bg-white rounded-lg font-MorabbaBold shadow-md p-10 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">فرم ورود</h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-sm text-gray-700">
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            placeholder="email"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("email")} />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 text-sm text-gray-700">
            رمز عبور
          </label>
          <input
            type="password"
            id="password"
            placeholder="password"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("password")} />
            <p className='text-red-500'>{errors.password?.message}</p>

        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          ورود
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
