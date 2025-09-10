// routes.jsx
import React from 'react'; 
import Login from './page/login/login';
import Home from './page/Home/Home';
import Register from './page/register/register';
import MyDrive from "./page/MyDrive/MyDrive"
import Myshare from './page/MyShare/myshare';
const routes = [
  { path: '/', element: <Home /> },
  { path: '/Login', element: <Login /> },
  { path: '/Register', element: <Register/> },
  { path: '/my-drive-list', element: <MyDrive/> },
  { path: '/my-drive-share-list', element: <Myshare/> },
];

export default routes;
