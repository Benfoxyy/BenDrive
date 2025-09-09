import './App.css'
import { useNavigate, useRoutes } from 'react-router-dom'
import routes from './routes'
import { useEffect, useState } from 'react'
import AuthContext from './context/authContext' 

//! Main Url https://api.benben.pics

function App() {
  const route = useRoutes(routes)

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userInfos, setUserInfos] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()
  
  const login = async (token) => {
    setToken(token);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify({ token }));

    try {
      const res = await fetch(`https://api.benben.pics/accounts/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUserInfos(data);

        localStorage.setItem("user", JSON.stringify({ token, ...data }));
      }
    } catch (err) {
      console.error("خطا در گرفتن اطلاعات کاربر:", err);
    }
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setUserInfos({});
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      setToken(user.token);

      try {
        const res = await fetch(`https://api.benben.pics/accounts/me/`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) {
          logout();
          setLoading(false);
          return;
        }

        const data = await res.json();
        setIsLoggedIn(true);
        setUserInfos(data);

        localStorage.setItem("user", JSON.stringify({ token: user.token, ...data }));
      } catch (err) {
        console.error(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      token,
      userInfos,
      login,
      logout,
    }}>
      {route} 
    </AuthContext.Provider>
  )
}

export default App
