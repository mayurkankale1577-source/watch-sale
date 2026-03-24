"use client";

import { useEffect, useState } from "react";

export default function MyCustomers(){

const [customers,setCustomers] = useState([]);
const [stats,setStats] = useState({});

const [search,setSearch] = useState("");
const [page,setPage] = useState(1);
const limit = 10;

/* modal */

const [showModal,setShowModal] = useState(false);
const [selectedCustomer,setSelectedCustomer] = useState(null);

const [brands,setBrands] = useState([]);
const [models,setModels] = useState([]);
const [references,setReferences] = useState([]);

const [brandId,setBrandId] = useState("");
const [modelId,setModelId] = useState("");
const [reference,setReference] = useState("");

const [message,setMessage] = useState("");

/* ================= LOAD DATA ================= */

function loadData(){

const userId = localStorage.getItem("userid");

fetch(`/api/my-customers?page=${page}&search=${search}`,{
headers:{ userid:userId }
})
.then(res=>res.json())
.then(data=>{
setCustomers(data.customers || []);
setStats(data);
});

}

useEffect(()=>{
loadData();
},[page,search]);

/* ================= BRANDS ================= */

useEffect(()=>{
fetch("/api/brands")
.then(res=>res.json())
.then(setBrands);
},[]);

/* ================= MODELS ================= */

useEffect(()=>{

if(!brandId) return;

fetch(`/api/models?brand_id=${brandId}`)
.then(res=>res.json())
.then(setModels);

},[brandId]);

/* ================= REFERENCES ================= */

useEffect(()=>{

if(!modelId) return;

fetch(`/api/references?model_id=${modelId}`)
.then(res=>res.json())
.then(setReferences);

},[modelId]);

/* ================= OPEN MODAL ================= */

function openRequirement(customer){
setSelectedCustomer(customer);
setShowModal(true);
setMessage("");
}

/* ================= ADD REQUIREMENT ================= */

async function addRequirement(e){

e.preventDefault();

const userId = localStorage.getItem("userid");

const res = await fetch("/api/requirements",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
customer_id:selectedCustomer.id,
brand_id:brandId,
model_id:modelId,
reference_number:reference || null,
sales_person_id:userId
})
});

const data = await res.json();

setMessage(data.message);

setBrandId("");
setModelId("");
setReference("");

loadData();
}

/* ================= TOTAL PAGES ================= */

const totalPages = Math.ceil((stats.customersCount || 0) / limit) || 1;

/* ================= UI ================= */

return(

<div className="content">

{/* ================= CARDS ================= */}

<h2 className="ad-title">ALL DETAILS</h2>

<div className="ad-cards">

<Card title="My Customers" value={stats.customersCount}/>
<Card title="My Requests" value={stats.requestsCount}/>
<Card title="Sold" value={stats.soldCount}/>
<Card title="Cancelled" value={stats.cancelledCount}/>
<Card title="Waiting" value={stats.waitingCount}/>

</div>

{/* ================= TABLE ================= */}

<div className="table-box">

<h3>MY CLIENT</h3>

{/* SEARCH */}

<input
className="search"
placeholder="Search client..."
value={search}
onChange={(e)=>{
setSearch(e.target.value);
setPage(1);
}}
/>

<table className="table">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Address</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{customers.map(c=>(

<tr key={c.id}>

<td>{c.name}</td>
<td>{c.email}</td>
<td>{c.phone}</td>
<td>{c.address}</td>

<td>
{c.total_requests > 0
? c.total_requests + " Requests"
: "No Request"}
</td>

<td>

<button
className="btn"
onClick={()=>openRequirement(c)}
>
Add Requirement
</button>

</td>

</tr>

))}

</tbody>

</table>

{/* ================= PAGINATION ================= */}

<div style={{marginTop:"15px"}}>

<button
onClick={()=>setPage(p=>p-1)}
disabled={page===1}
>
Prev
</button>

<span style={{margin:"0 10px"}}>
Page {page} / {totalPages}
</span>

<button
onClick={()=>setPage(p=>p+1)}
disabled={page===totalPages}
>
Next
</button>

</div>

</div>

{/* ================= MODAL ================= */}

{showModal && (

<div className="modal-overlay">

<div className="modal-box">

<h3>Add Requirement</h3>

<p>Customer: {selectedCustomer.name}</p>

{message && <p className="success-msg">{message}</p>}

<form onSubmit={addRequirement}>

<label>Brand</label>

<select
className="form-input"
value={brandId}
onChange={(e)=>setBrandId(e.target.value)}
required
>

<option value="">Select Brand</option>

{brands.map(b=>(
<option key={b.id} value={b.id}>
{b.name}
</option>
))}

</select>

<label>Model</label>

<select
className="form-input"
value={modelId}
onChange={(e)=>setModelId(e.target.value)}
required
>

<option value="">Select Model</option>

{models.map(m=>(
<option key={m.id} value={m.id}>
{m.name}
</option>
))}

</select>

<label>Reference</label>

<select
className="form-input"
value={reference}
onChange={(e)=>setReference(e.target.value)}
>

<option value="">Any Reference</option>

{references.map(r=>(
<option key={r.reference_number} value={r.reference_number}>
{r.reference_number}
</option>
))}

</select>

<button className="form-button">
Add Requirement
</button>

</form>

<button
className="cancel-btn"
onClick={()=>setShowModal(false)}
>
Close
</button>

</div>

</div>

)}

</div>

);

}

/* ================= CARD COMPONENT ================= */

function Card({title,value}){

return(

<div className="ad-card">

<h4>{title}</h4>
<p>{value || 0}</p>

</div>

);

}