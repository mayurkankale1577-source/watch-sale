"use client";

import { useState, useEffect } from "react";

export default function UpdateCustomerForm({ editData, onSuccess }) {

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");

const [salesUsers,setSalesUsers] = useState([]);
const [assignedTo,setAssignedTo] = useState("");

const [errors,setErrors] = useState({});

/* 🔥 load edit data */
useEffect(()=>{
if(editData){
setName(editData.name || "");
setEmail(editData.email || "");
setPhone(editData.phone || "");
setAddress(editData.address || "");
setAssignedTo(editData.assigned_to || "");
}
},[editData]);

/* sellers */
useEffect(()=>{
fetch("/api/sales-users")
.then(res => res.json())
.then(data => setSalesUsers(data));
},[]);

/* validation (same as old) */
function validate(){

let newErrors = {};

if(!name.trim()){
newErrors.name = "Client name required";
}else if(!/^[A-Za-z\s]+$/.test(name)){
newErrors.name = "Only letters allowed";
}

if(!email.trim()){
newErrors.email = "Email required";
}else if(!/^\S+@\S+\.\S+$/.test(email)){
newErrors.email = "Invalid email format";
}

if(!phone.trim()){
newErrors.phone = "Phone required";
}else if(!/^[0-9]{10}$/.test(phone)){
newErrors.phone = "Enter 10 digit phone number";
}

if(!address.trim()){
newErrors.address = "Address required";
}

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
}

/* 🔥 UPDATE */
async function updateCustomer(e){

e.preventDefault();

if(!validate()) return;

const res = await fetch("/api/customers",{
method:"PUT",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
id: editData.id,
name,
email,
phone,
address,
assigned_to: assignedTo || null
})
});

const data = await res.json();
alert(data.message);

onSuccess && onSuccess();
}

return(

<div>
<div className="form-container">

<div className="form-card">

<h3 className="form-title">UPDATE CLIENT</h3>

<form onSubmit={updateCustomer}>

<label className="form-label">Name</label>

<input
className="form-input"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

{errors.name && <p className="error">{errors.name}</p>}

<label className="form-label">Email</label>

<input
className="form-input"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

{errors.email && <p className="error">{errors.email}</p>}

<label className="form-label">Phone</label>

<input
className="form-input"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

{errors.phone && <p className="error">{errors.phone}</p>}

<label className="form-label">Address</label>

<input
className="form-input"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

{errors.address && <p className="error">{errors.address}</p>}

<label className="form-label">Assign Sales Person</label>

<select
className="form-input"
value={assignedTo}
onChange={(e)=>setAssignedTo(e.target.value)}
>

<option value="">Assign Sales Person</option>

{salesUsers.map((user)=>(
<option key={user.id} value={user.id}>
{user.name}
</option>
))}

</select>

<button className="form-button">
Update Client
</button>

</form>

</div>

</div>
</div>

);

}