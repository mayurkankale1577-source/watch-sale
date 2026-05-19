"use client";

import { useState, useEffect } from "react";

export default function AddCustomerForm({ adminId }) {

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");

const [salesUsers,setSalesUsers] = useState([]);
const [assignedTo,setAssignedTo] = useState("");

const [errors,setErrors] = useState({});

const [currentAdmin,setCurrentAdmin] = useState(adminId || null);


/* get admin id from localStorage if not passed */

useEffect(()=>{
const id = localStorage.getItem("userid");
if(!currentAdmin && id){
setCurrentAdmin(id);
}
},[]);


/* fetch sales users */

useEffect(()=>{

fetch("/api/sales-users")
.then(res => res.json())
.then(data => setSalesUsers(data));

},[]);



/* validation */

function validate(){

let newErrors = {};

// name
if(!name.trim()){
newErrors.name = "Client name required";
}else if(!/^[A-Za-z\s]+$/.test(name)){
newErrors.name = "Only letters allowed";
}

// email
if(!email.trim()){
newErrors.email = "Email required";
}else if(!/^\S+@\S+\.\S+$/.test(email)){
newErrors.email = "Invalid email format";
}

// phone
if(!phone.trim()){
newErrors.phone = "Phone required";
}else if(!/^[0-9]{10}$/.test(phone)){
newErrors.phone = "Enter 10 digit phone number";
}

// address
if(!address.trim()){
newErrors.address = "Address required";
}

setErrors(newErrors);

return Object.keys(newErrors).length === 0;

}


/* submit */

async function addCustomer(e){

e.preventDefault();

if(!validate()) return;

const res = await fetch("/api/customers",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
name,
email,
phone,
address,
assigned_to: assignedTo || null,   // ⭐ seller optional
created_by: currentAdmin
})
});

const data = await res.json();

alert(data.message);

/* reset form */

setName("");
setEmail("");
setPhone("");
setAddress("");
setAssignedTo("");

}


return(

<div className="content">
<div className="form-container">

<div className="form-card">

<h3 className="form-title">ADD CLIENT</h3>

<form onSubmit={addCustomer}>

<label className="form-label">Name</label>

<input
className="form-input"
placeholder="Client Name"
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



<label className="form-label">Phone</label>

<input
className="form-input"
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

{errors.phone && <p className="error">{errors.phone}</p>}



<label className="form-label">Address</label>

<input
className="form-input"
placeholder="Address"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

{errors.address && <p className="error">{errors.address}</p>}



{/* Seller optional */}
<label className="form-label">Assign Sales Person</label>
<select
className="form-input"
value={assignedTo}
onChange={(e)=>setAssignedTo(e.target.value)}
>

<option value="">Assign Sales Person </option>

{salesUsers.map((user)=>(
<option key={user.id} value={user.id}>
{user.name}
</option>
))}

</select>



<button className="form-button">
Add Client
</button>

</form>

</div>

</div>
</div>

);

}