"use client";

import { useState, useEffect } from "react";

export default function UpdateUserForm({ user, onClose, onUpdated }) {

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [role,setRole] = useState("");
const [password,setPassword] = useState("");

useEffect(()=>{

if(user){
setName(user.name || "");
setEmail(user.email || "");
setRole(user.role || "");
}

},[user]);

async function updateUser(e){

e.preventDefault();

const res = await fetch("/api/all-users",{
method:"PUT",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
id:user.id,
name,
email,
role,
password
})
});

const data = await res.json();

alert(data.message);

onUpdated && onUpdated();
onClose && onClose();

}

return(

<div className="modal-overlay">

<div className="modal-box">

<button className="cross-btn" onClick={onClose}>✖</button>

<h3 className="form-title">UPDATE USER</h3>

<form onSubmit={updateUser}>

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
className="form-input"
type="password"
placeholder="Leave blank to keep same"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<label className="form-label">Role</label>

<select
className="form-input"
value={role}
onChange={(e)=>setRole(e.target.value)}
>

<option value="admin">Admin</option>
<option value="manager">Manager</option>
<option value="sales">Sales</option>

</select>

<button className="form-button">
Update User
</button>

</form>

</div>

</div>

)

}