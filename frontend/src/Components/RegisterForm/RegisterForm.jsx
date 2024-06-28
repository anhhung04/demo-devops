import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './RegisterForm.css'
import { FaUserAlt, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import callAPI from '@utils/api';


const RegisterForm = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  
  const togglePassword = () => {
    setshowPassword(!showPassword);
  }

  const toggleConfirmPassword = () => {
    setshowConfirmPassword(!showConfirmPassword);
  }

  const passwordRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const emailRegex = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
  
  const validateEmail = () => {
    return emailRegex.test(email);
  } 
  
  const validatePassword = () => {
    return passwordRegex.test(password);
  } 

  const matchPassword = () => {
    return password == confirmpassword;
  }

  const submitForm = async (e) => {
    e.preventDefault();
    // if (!validateEmail()) {
    //   alert('Invalid Email');
    //   return;
    // }
    // if (!validatePassword()) {
    //   alert('Invalid Password');
    //   return;
    // }
    // if (!matchPassword()) {
    //   alert('Password does not match');
    //   return;
    // }

    callAPI('/api/auth/signup', 'POST', {username: username, email: email, password: password})
      .then(
        res => {
          if (res && res["code"] === 200 ) {
            window.location = '/login';
          } else {
            alert('Registration failed');
          }
        }
      ).catch(
        alert('Registration failed')
      )
  }
  return (
    <div className='wrapper'>
      <form action="">
        <h1> REGISTER </h1>
        <div className='input-box'>
          <input type='email' placeholder='Email' onChange={(e) => setemail(e)} required/>
          <FaEnvelope />
        </div>
        <div className='input-box'>
          <input type='text' placeholder='Username' onChange={(e) => setusername(e)} required/>
          <FaUserAlt />
        </div>
        <div className="input-box">
          <input type={showPassword ? 'text' : 'password'} placeholder='Password' onChange={(e) => setpassword(e)} required /> 
          <div className='icon' onClick={togglePassword}>
            {showPassword ? <FaEyeSlash />: <FaEye/>}
          </div>
        </div>
        <div className="input-box">
          <input type={showConfirmPassword ? 'text' : 'password'} placeholder='Confirm password' onChange={(e) => setconfirmpassword(e)} required /> 
          <div className='icon' onClick={toggleConfirmPassword}>
            {showConfirmPassword ? <FaEyeSlash />: <FaEye/>}
          </div>
        </div>
        <button type="submit" onClick={submitForm}> Register </button>
        <div className='register-link'>
          <p> Already have an account? <Link to="/login"> Login </Link> </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm