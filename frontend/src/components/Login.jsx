import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(true);

    const [details, setDetails] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) =>{
        setDetails({...details, [e.target.name]: e.target.value})
    }

    const handleSubmit = async () =>{
        navigate("/dashboard");
        if(toggle){
            try{
                const response = await axios.post("http://localhost:5000/auth/login", {
                    email: details.email,
                    password: details.password
                });
                navigate("/dashboard");
                console.log(response.data);
            } catch(error){
                console.error("Login failed:", error);
            }
        } else {
            if(details.password === details.confirmPassword){
                try{
                    const response = await axios.post("http://localhost:5000/auth/signup", {
                        email: details.email,
                        password: details.password
                    });
                    navigate("/dashboard");
                    console.log(response.data);
                } catch(error){
                    console.error("Signup failed:", error);
                }
            } else {
                console.error("Passwords do not match");
            }
        }
    }
    

    return (
        <div className="w-4/5 bg-white rounded-md py-4 px-6">
            <h1 className='text-xl font-semibold mb-4'>{toggle ? "Login" : "Sign Up"}</h1>
            <div className='flex flex-col items-center'>
                {toggle ? 
                    <div className='w-4/5'>
                        <form className='flex flex-col gap-2'>
                            <h3>Email</h3>
                            <input name="email" className="w-full border border-slate-400 rounded-md p-2" type="text" placeholder='Enter your email' onChange={handleChange} />
                            <h3>Password</h3>
                            <input name="password" className="w-full border border-slate-400 rounded-md p-2" type="password" placeholder='Enter your password' onChange={handleChange} />
                            <button type='submit' className='bg-blue-500 text-white p-2 rounded-md mt-2' onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                    :
                    <div className='w-4/5'>
                        <form className='flex flex-col gap-2'>
                            <h3>Email</h3>
                            <input name="email" className="w-full border border-slate-400 rounded-md p-2" type="text" placeholder='Enter your email' onChange={handleChange} />
                            <h3>Password</h3>
                            <input name="password" className="w-full border border-slate-400 rounded-md p-2" type="password" placeholder='Enter your password' onChange={handleChange}/>
                            <h3>Confirm Password</h3>
                            <input name="confirmPassword" className="w-full border border-slate-400 rounded-md p-2" type="password" placeholder='Enter your password' onChange={handleChange}/>
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