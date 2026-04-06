"use client";

import { useState, useEffect } from "react";

export default function CreateUserForm(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("sales");

const [currentRole,setCurrentRole] = useState("");
const [storeId,setStoreId] = useState("");

const [errors,setErrors] = useState({});

useEffect(()=>{

async function loadUser(){

const res = await fetch("/api/me");
const data = await res.json();

if(data.user){

setCurrentRole(data.user.role);

/* default role set */

if(data.user.role === "admin"){
setRole("admin");
}

else if(data.user.role === "manager"){
setRole("sales");
}

}

}

loadUser();

},[]);

function validate(){

let newErrors = {};

// name validation 
if(!name.trim()){
newErrors.name = "Name is required";
}else if(!/^[A-Za-z\s]+$/.test(name)){
newErrors.name = "Only letters allowed";
}

// email validation
if(!email.trim()){
newErrors.email = "Email required";
}else if(!/^\S+@\S+\.\S+$/.test(email)){
newErrors.email = "Invalid email format";
}

// password validation
if(!password.trim()){
newErrors.password = "Password required";
}else if(password.length < 4){
newErrors.password = "Minimum 4 characters";
}

/* store validation only for admin */

if(currentRole === "admin" && !storeId){
newErrors.store = "Store required";
}

setErrors(newErrors);

return Object.keys(newErrors).length === 0;

}

async function createUser(e){

e.preventDefault();

if(!validate()) return;

const res = await fetch("/api/users",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
name,
email,
password,
role,
store_id:storeId
})
});

if(!res.ok){
alert("Server error");
return;
}

const data = await res.json();

alert(data.message);

/* reset form */

setName("");
setEmail("");
setPassword("");
setStoreId("");

}

return(

<div className="content">
<div className="form-container">

<div className="form-card">

<h3 className="form-title">Create User</h3>

<form onSubmit={createUser}>

<label className="form-label">Name</label>

<input
className="form-input"
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

{errors.name && <p className="error">{errors.name}</p>}

<label className="form-label">Email</label>

<input
className="form-input"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

{errors.email && <p className="error">{errors.email}</p>}

<label className="form-label">Password</label>

<input
className="form-input"
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{errors.password && <p className="error">{errors.password}</p>}

<label className="form-label">Select Role</label>

<select
className="form-input"
value={role}
onChange={(e)=>setRole(e.target.value)}
>

{/* Admin options */}

{currentRole === "admin" && (
<>
<option value="admin">Admin</option>
<option value="manager">Manager</option>
<option value="sales">Sales</option>
</>
)}

{/* Manager options */}

{currentRole === "manager" && (
<option value="sales">Sales</option>
)}

</select>

{/* STORE SELECT ONLY FOR ADMIN */}

{currentRole === "admin" && (

<>

<label className="form-label">Select Store</label>

<select
className="form-input"
value={storeId}
onChange={(e)=>setStoreId(e.target.value)}
>

<option value="">Select Store</option>
<option value="1">Mumbai Store</option>
<option value="2">Pune Store</option>

</select>

{errors.store && <p className="error">{errors.store}</p>}

</>

)}

<button className="form-button">
Create User
</button>

</form>

</div>

</div>
</div>

)

}