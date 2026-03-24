"use client";

import { useState, useEffect } from "react";

export default function AddRequirementPage(){

const [customers,setCustomers] = useState([]);
const [brands,setBrands] = useState([]);
const [models,setModels] = useState([]);
const [references,setReferences] = useState([]);

const [customerId,setCustomerId] = useState("");
const [brandId,setBrandId] = useState("");
const [modelId,setModelId] = useState("");
const [reference,setReference] = useState("");

const [userId,setUserId] = useState(null);
const [message,setMessage] = useState("");

/* logged user */

useEffect(()=>{

const storedUserId = localStorage.getItem("userid");

if(!storedUserId){
window.location.href="/login";
return;
}

setUserId(storedUserId);

},[]);


/* customers */

useEffect(()=>{

if(!userId) return;

fetch("/api/my-customers",{
headers:{ userid:userId }
})
.then(res=>res.json())
.then(data=>setCustomers(data));

},[userId]);


/* brands */

useEffect(()=>{

fetch("/api/brands")
.then(res=>res.json())
.then(data=>setBrands(data));

},[]);


/* models by brand */

useEffect(()=>{

if(!brandId) return;

fetch(`/api/models?brand_id=${brandId}`)
.then(res=>res.json())
.then(data=>setModels(data));

},[brandId]);


/* references by model */

useEffect(()=>{

if(!modelId) return;

fetch(`/api/references?model_id=${modelId}`)
.then(res=>res.json())
.then(data=>setReferences(data));

},[modelId]);


async function addRequirement(e){

e.preventDefault();

if(!customerId || !brandId || !modelId){
setMessage("Please fill all fields");
return;
}

const res = await fetch("/api/requirements",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
customer_id:customerId,
brand_id:brandId,
model_id:modelId,
reference_number:reference || null,
sales_person_id:userId
})

});

const data = await res.json();

setMessage(data.message);

setCustomerId("");
setBrandId("");
setModelId("");
setReference("");

}


return(
<div className="content">
<div className="form-container">

<div className="page-center">

<div className="form-card">

<h2>Add Requirement</h2>

{message && (
<p className="success-msg">{message}</p>
)}

<form onSubmit={addRequirement}>

{/* Customer */}

<label>Customer</label>

<select
className="form-input"
value={customerId}
onChange={(e)=>setCustomerId(e.target.value)}
required
>

<option value="">Select Customer</option>

{customers.map((c)=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>



{/* Brand */}

<label>Brand</label>

<select
className="form-input"
value={brandId}
onChange={(e)=>setBrandId(e.target.value)}
required
>

<option value="">Select Brand</option>

{brands.map((b)=>(
<option key={b.id} value={b.id}>
{b.name}
</option>
))}

</select>



{/* Model */}

<label>Model</label>

<select
className="form-input"
value={modelId}
onChange={(e)=>setModelId(e.target.value)}
required
>

<option value="">Select Model</option>

{models.map((m)=>(
<option key={m.id} value={m.id}>
{m.name}
</option>
))}

</select>



{/* Reference (optional) */}

<label>Reference (optional)</label>

<select
className="form-input"
value={reference}
onChange={(e)=>setReference(e.target.value)}
>

<option value="">Any Reference</option>

{references.map((r)=>(
<option key={r.reference_number} value={r.reference_number}>
{r.reference_number}
</option>
))}

</select> 



<button className="form-button">
Add Requirement
</button>

</form>

</div>

</div>

</div>
</div>

);
}