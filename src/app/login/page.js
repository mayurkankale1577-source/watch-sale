"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import "./login.css";

export default function LoginPage() {

const router = useRouter();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [captchaToken,setCaptchaToken] = useState("");

async function handleLogin(e){

e.preventDefault();
if(!captchaToken){

    alert("Please verify captcha");
    return;
    
    }
const res = await fetch("/api/login",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
    email,
    password,
    captchaToken
    })
});

const data = await res.json();

if(data.success){

    localStorage.setItem("userid", data.user.id);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("store_id", data.user.store_id);
if(data.user.role === "admin" || data.user.role === "manager"){
router.push("/dashboard");
}

else if(data.user.role === "sales"){
router.push("/sales/dashboard");
}

}else{
alert("Invalid Login"); 
}

}

return (
    <div>

<header className="login-header">
          <img className="logo" src="/images/patekphilippe-header-logo.jpg" />
          <img className="logo" src="/images/patekphilippe-header-logo.jpg" />
        </header>

<div className="login-container">

<div className="login-card">

<div className="login-banner">
<img src="/images/user.png" className="login-avatar"/>
</div>

<h2>Login</h2>

<form onSubmit={handleLogin}>

<div className="input-group">
<label>Email</label>
<input
type="email"
placeholder="Enter email"
onChange={(e)=>setEmail(e.target.value)}
/>
</div>

<div className="input-group">
<label>Password</label>
<input
type="password"
placeholder="Enter password"
onChange={(e)=>setPassword(e.target.value)}
/>
</div>
<p
className="forgot-text"
onClick={()=>router.push("/login-forgot-password")}
>
Forgot Password?
</p>

<div style={{marginBottom:"15px"}}>

<ReCAPTCHA
sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
onChange={(token)=>setCaptchaToken(token)}
/>

</div>

<button className="login-btn">
Login
</button>

</form>

</div>

</div>

</div>

);

}