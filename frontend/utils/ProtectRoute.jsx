import { useEffect } from "react";
import { useAuth } from "./UserContext";
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({children}) =>{
    const {user, userlogin, userLogout} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(user.email===""){
            navigate('/');
        }
    },[navigate, user])

    return <>{children}</>
}

export default ProtectedRoute