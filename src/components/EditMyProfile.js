"use client";

import { useState } from "react";

export default function EditMyProfile({user,onClose,onUpdated}){

const [name,setName] = useState(user.name);
const [email,setEmail] = useState(user.email);
const [password,setPassword] = useState("");

async function updateProfile(e){

e.preventDefault();

const res = await fetch("/api/my-profile",{
method:"PUT",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
name,
email,
password
})
});

const data = await res.json();

alert(data.message);

if(data.success){

onUpdated({
...user,
name,
email
});

}

}

return(

<div className="modal-overlay">

<div className="form-card">

<h3 className="form-title">EDIT PROFILE</h3>

<form onSubmit={updateProfile}>

<label className="form-label">Name</label>

<input
className="form-input"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<label className="form-label">Email</label>

<input
className="form-input"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<label className="form-label">Password</label>

<input
type="password"
className="form-input"
placeholder="Leave blank to keep same"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="form-button">
Update Profile
</button>

<button
type="button"
className="btn"
onClick={onClose}
>
Cancel
</button>

</form>

</div>

</div>

);

}