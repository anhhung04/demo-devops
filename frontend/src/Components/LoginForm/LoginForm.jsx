import React, { useState } from 'react'
import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";


import './LoginForm.css'
import { Link } from 'react-router-dom';
import callAPI from '@utils/api';

const LoginForm = () => {
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");

  const [showPassword, setshowPassword] = useState(false);
  
  const [fail, setfail] = useState(false)

  const togglePassword = () => {
    setshowPassword(!showPassword)
  }

  const submitForm = async (e) => {
    e.preventDefault();
    await callAPI('/api/auth/signin', 'POST', {username: username, password: password})
      .then(
        res => {
          if (res && res["code"] === 200 ) {
            window.location = '/home';
          } else {
            setfail(true);
          }
        }
      ).catch(
        setfail(true)
      )
  }

  return (
    <div className='wrapper'>
      <form action="">
        <h1> LOGIN </h1>
        {fail ? <p className='warning'> Invalid Credential </p> : <></>}
        <div className='input-box'>
          <input type='text' placeholder='Username' onChange={(e) => setusername(e)} required/>
          <FaUserAlt />
        </div>
        <div className="input-box">
          <input type={showPassword ? 'text' : 'password'} placeholder='Password' onChange={(p)=> setpassword(p) } required /> 
          <div className='icon' onClick={togglePassword}>
            {showPassword ? <FaEyeSlash />: <FaEye/>}
          </div>
          
        </div>
        <div className='remember-forgot'>
          <label><input type='checkbox' /> Rememeber me</label>
          <Link to="#"> Forgot password </Link> 
        </div>
        <button type="submit" onClick={submitForm}> Login </button>
        <button type="button"> Login with Google  <FcGoogle /> </button>
        <div className='register-link'>
          <p> Don't have an account? <Link to="/register"> Register </Link> </p>
        </div>
      </form> 
    </div>
  )
}

export default LoginForm