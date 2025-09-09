import React  from 'react';
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
    .required("این فیلد الزامی است") 
    .email("ایمیل معتبر وارد کنید"),

  password: yup.string()
    .required("این فیلد الزامی است")
    .min(6, "پسورد باید حداقل 6 کاراکتر باشد"),

  confirmpassword: yup.string()
    .required("این فیلد الزامی است")
    .min(6, "پسورد باید حداقل 6 کاراکتر باشد")
    .oneOf([yup.ref("password")], "پسورد مطابقت ندارد"),
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
          title: "با موفقیت ثبت نام شدید",
          buttons: "رفتن به صفحه ",
          icon: "success",
        }).then(() => {
          navigate("/login");
        })
      } else if(res.status === 400) {
        swal({
          title: "با این اطلاعات قبلا ثبت نام انجام شده",
          buttons: "باشه",
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
        <h2 className="text-2xl font-semibold text-gray-800 text-center">ثبت نام</h2>

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

        <div className="flex flex-col">
          <label htmlFor="confirmpassword" className="mb-2 text-sm text-gray-700">تکرار رمز عبور</label>
          <input
            type="password"
            id="confirmpassword"
            placeholder="confirmpassword"
            className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("confirmpassword")}
          />
          <p className='text-red-500 mt-1.5'>{errors.confirmpassword?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          ثبت نام
        </button>
        <div className='text-center mt-4'>
          <Link to={"/login"}>
                <span className='font-MorabbaBold'>حساب کاربری دارید؟  <span className='text-blue-500'>لاگین کنید</span></span>
            </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
