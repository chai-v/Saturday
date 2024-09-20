import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/UserContext';
import { useChat } from '../../utils/ChatContext';

function Login() {
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(true);
    const {user, userlogin, userlogout} = useAuth()
    const { updateChat, chatID, setChatID, chat, setChat, chatHistory, setChatHistory, updated, setUpdated } = useChat();
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    const [details, setDetails] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) =>{
        setDetails({...details, [e.target.name]: e.target.value})
    }

    const clearError = () => {
        document.getElementById("error").innerHTML = "";
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(toggle){
            try{
                const response = await axios.post("https://saturday-3fw7.onrender.com/auth/login", {
                    email: details.email,
                    password: details.password
                });
                await userlogin(response.data);
            } catch(error){
                document.getElementById("error").innerHTML = "Invalid login: "+error.response.data.errors[0].msg;
                console.error("Login failed:", error);
            }
        } else {
            if(details.password === details.confirmPassword){
                try{
                    const response = await axios.post("https://saturday-3fw7.onrender.com/auth/signup", {
                        email: details.email,
                        password: details.password
                    });
                    console.log(response.data);
                    navigate("/dashboard");
                    await userlogin(response.data);
                } catch(error){
                    document.getElementById("error").innerHTML = "Invalid signup: "+error.response.data.errors[0].msg;
                    console.error("Signup failed:", error);
                }
            } else {
                document.getElementById("error").innerHTML = "Invalid signup: Passwords do not match";
                console.error("Passwords do not match");
            }
        }
    }

    useEffect(()=>{
        if(user && user.email!==''){
            navigate("/dashboard");
        }
    },[user])
    

    return (
        <div className={`${isMobile ? 'w-full' : 'w-4/5' } bg-white rounded-md py-4 px-6`}>
            <h1 className='text-xl font-bold mb-4'>{toggle ? "Login" : "Sign Up"}</h1>
            <div className='flex flex-col items-center'>
                {toggle ? 
                    <div className='w-4/5'>
                        <form className='flex flex-col gap-2'>
                            <h3>Email</h3>
                            <input name="email" className="w-full border border-slate-400 rounded-md p-2" type="text" placeholder='Enter your email' onChange={handleChange} onFocus={clearError}/>
                            <h3>Password</h3>
                            <input name="password" className="w-full border border-slate-400 rounded-md p-2" type="password" placeholder='Enter your password' onChange={handleChange} onFocus={clearError}/>
                            <span id='error' className='w-full text-center text-red-500 text-sm'></span>
                            <button type='submit' className='bg-blue-500 text-white p-2 rounded-md mt-2' onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                    :
                    <div className='w-4/5'>
                        <form className='flex flex-col gap-2'>
                            <h3>Email</h3>
                            <input name="email" className="w-full border border-slate-400 rounded-md p-2" type="text" placeholder='Enter your email' onChange={handleChange} onFocus={clearError}/>
                            <h3>Password</h3>
                            <input name="password" className="w-full border border-slate-400 rounded-md p-2" type="password" placeholder='Enter your password' onChange={handleChange} onFocus={clearError}/>
                            <h3>Confirm Password</h3>
                            <input name="confirmPassword" className="w-full border border-slate-400 rounded-md p-2" type="password" placeholder='Enter your password' onChange={handleChange} onFocus={clearError}/>
                            <span id='error' className='w-full text-center text-red-500 text-sm'></span>
                            <button type='submit' className='bg-blue-500 text-white p-2 rounded-md mt-2' onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                }
            </div>
            <div className='flex flex-col items-center mt-3'>
                <button className="text-sm text-slate-500" onClick={() => setToggle(!toggle)}>{toggle ? "New here? Create an account" : "Already have an account? Login"}</button>
            </div>
        </div>
    )
}

export default Login