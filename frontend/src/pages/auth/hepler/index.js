export const getRole = (next)=>{
    if (localStorage.getItem("userInfo")) {
        var loginUser = localStorage.getItem("userInfo");
        var parsedloginuser = JSON. parse(loginUser)
        var role = parsedloginuser.userType
        return role;
    }
};

export const signout = (next)=>{
    if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo")
    
    }

};

export const isLoggedin = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("userInfo")) {
        return JSON.parse(localStorage.getItem("userInfo"))
    }else {
        return false;
    };

};