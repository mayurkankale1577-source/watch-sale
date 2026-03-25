"use client";

import { useState,useEffect } from "react";

export default function AssignCustomer(){

const [customers,setCustomers] = useState([]);
const [salesUsers,setSalesUsers] = useState([]);

const [customerId,setCustomerId] = useState("");
const [sellerId,setSellerId] = useState("");
const [message,setMessage] = useState("");

/* customers */

useEffect(()=>{
fetch("/api/customers")
.then(res=>res.json())
.then(setCustomers);
},[]);


/* sellers */

useEffect(()=>{
fetch("/api/sales-users")
.then(res=>res.json())
.then(setSalesUsers);
},[]);


async function assignCustomer(e){

e.preventDefault();

const res = await fetch("/api/assign-customer",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
customer_id:customerId,
seller_id:sellerId
})

});

const data = await res.json();
setMessage(data.message);

}


return(

<div className="content">
<div className="form-container">

<div className="form-card">

<h2 className="form-title">ASSIGN CLIENT</h2>

{message && <p className="success-msg">{message}</p>}

<form onSubmit={assignCustomer}>

<label className="form-label">Client</label>

<select
className="form-input"
value={customerId}
onChange={(e)=>setCustomerId(e.target.value)}
>

<option value="">Select Client</option>

{customers.map(c=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>


<label className="form-label">Seller</label>

<select
className="form-input"
value={sellerId}
onChange={(e)=>setSellerId(e.target.value)}
>

<option value="">Select Seller</option>

{salesUsers.map(u=>(
<option key={u.id} value={u.id}>
{u.name}
</option>
))}

</select>

<button className="form-button">
Assign
</button>

</form>

</div>

</div>
</div>

)

}