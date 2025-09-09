import { createContext } from "react";

const authContext = createContext({

    isLoggedIn: false,
    token: null,
    userInfos: null,
    login: () => {},
    logout: () => {},
})
export default authContext