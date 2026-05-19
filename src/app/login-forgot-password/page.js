"use client";

import { useState } from "react";
import "../login/login.css";

export default function LoginForgotPassword(){

const [email,setEmail] = useState("");
const [message,setMessage] = useState("");

async function handleSubmit(e){

e.preventDefault();

const res = await fetch("/api/login-forgot-password",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email})

});

const data = await res.json();

setMessage(data.message);

}

return(

<div className="login-container">

<div className="login-card">

<h2>Forgot Password</h2>

{message && (
<p className="success-msg">{message}</p>
)}

<form onSubmit={handleSubmit}>

<div className="input-group">

<label>Email</label>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>

<button className="login-btn">
Send Reset Link
</button>

</form>

</div>

</div>

)

}