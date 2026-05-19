"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../login/login.css";

function ResetLoginPasswordContent(){

const router = useRouter();

const searchParams = useSearchParams();

const token = searchParams.get("token");

const [password,setPassword] = useState("");
const [message,setMessage] = useState("");

async function handleReset(e){

e.preventDefault();

const res = await fetch("/api/reset-login-password",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
token,
password
})

});

const data = await res.json();

setMessage(data.message);

if(data.success){

setTimeout(()=>{

router.push("/login");

},2000);

}

}

return(

<div className="login-container">

<div className="login-card">

<h2>Reset Password</h2>

{message && (
<p className="success-msg">
{message}
</p>
)}

<form onSubmit={handleReset}>

<div className="input-group">

<label>New Password</label>

<input
type="password"
placeholder="Enter new password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

</div>

<button className="login-btn">
Reset Password
</button>

</form>

</div>

</div>

);

}

export default function ResetLoginPasswordPage(){

return(

<Suspense fallback={<div>Loading...</div>}>
<ResetLoginPasswordContent />
</Suspense>

);

}