"use client";

import { useState, useEffect } from "react";

export default function AddCustomerPage(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");

const [userId,setUserId] = useState(null);
const [message,setMessage] = useState("");

useEffect(()=>{

const storedUserId = localStorage.getItem("userid");

if(!storedUserId){
window.location.href="/login";
return;
}

setUserId(storedUserId);

},[]);



async function addCustomer(e){

e.preventDefault();

const res = await fetch("/api/customers",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
phone,
address,
assigned_to:userId,
created_by:userId
})

});

const data = await res.json();

setMessage(data.message);

/* reset form */

setName("");
setEmail("");
setPhone("");
setAddress("");

}



return(

<div className="page-center">

<div className="form-card">

<h2>Add Customer</h2>

{message && (
<p className="success-msg">{message}</p>
)}

<form onSubmit={addCustomer}>

<label>Name</label>
<input
className="form-input"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<label>Email</label>
<input
className="form-input"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<label>Phone</label>
<input
className="form-input"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
required
/>

<label>Address</label>
<input
className="form-input"
value={address}
onChange={(e)=>setAddress(e.target.value)}
required
/>

<button className="form-button">
Add Customer
</button>

</form>

</div>

</div>

)

}