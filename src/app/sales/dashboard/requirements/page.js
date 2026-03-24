"use client";

import { useEffect, useState } from "react";

export default function Requirements(){

const [requirements,setRequirements] = useState([]);
const [page,setPage] = useState(1);
const [total,setTotal] = useState(0);

const [status,setStatus] = useState("all");
const [search,setSearch] = useState("");

const limit = 10;

/* ================= LOAD DATA ================= */

function loadData(){

const userId = localStorage.getItem("userid");

fetch(`/api/my-requirements?page=${page}&status=${status}&search=${search}`,{
headers:{ userid:userId }
})
.then(res=>res.json())
.then(data=>{
setRequirements(data.data || []);
setTotal(data.total || 0);
});

}

useEffect(()=>{
loadData();
},[page,status,search]);

const totalPages = Math.ceil(total / limit);

/* ================= COMPLETE SALE ================= */

async function completeSale(r){

const userId = localStorage.getItem("userid");

const res = await fetch("/api/complete-sale",{

method:"POST",

headers:{
"Content-Type":"application/json",
userid:userId
},

body:JSON.stringify({ 
requirement_id:r.id,
watch_id:r.watch_id,
customer_id:r.customer_id
})

});

const data = await res.json();

alert(data.message);

loadData();

}

/* ================= CANCEL ================= */

async function cancelRequirement(r){

const userId = localStorage.getItem("userid");

const res = await fetch("/api/cancel-assignment",{

method:"POST",

headers:{
"Content-Type":"application/json",
userid:userId
},

body:JSON.stringify({
requirement_id:r.id,
watch_id:r.watch_id
})

});

const data = await res.json();

alert(data.message);

loadData();

}

/* ================= UI ================= */

return(

<div className="content">

<h2 className="ad-title">MY REQUEST</h2>

{/* FILTERS */}

<div style={{display:"flex",gap:"10px",marginBottom:"15px"}}>

<select
value={status}
onChange={(e)=>{
setStatus(e.target.value);
setPage(1);
}}
>

<option value="all">All</option>
<option value="waiting">Waiting</option>
<option value="assigned">Assigned</option>
<option value="sold">Sold</option>
<option value="cancelled">Cancelled</option>

</select>

<input
className="search"
placeholder="Search customer..."
value={search}
onChange={(e)=>{
setSearch(e.target.value);
setPage(1);
}}
/>

</div>


<div className="table-box">

<table className="table">

<thead>
<tr>
<th>Customer</th>
<th>Brand</th>
<th>Model</th>
<th>Reference</th>
<th>Serial</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{requirements.map(r=>(

<tr key={r.id}>

<td>{r.customer_name}</td>
<td>{r.brand}</td>
<td>{r.model}</td>
<td>{r.reference_number || "-"}</td>
<td>{r.serial_number || "-"}</td>

<td>{r.status}</td>

<td>

{r.status === "assigned" && (
<>

<button
className="sale-btn"
onClick={()=>completeSale(r)}
>
Complete Sale
</button>

<button
className="cancel-btn"
onClick={()=>cancelRequirement(r)}
>
Cancel
</button>

</>
)}

</td>

</tr>

))}

</tbody>

</table>

</div>


{/* PAGINATION */}

<div style={{marginTop:"15px"}}>

<button
onClick={()=>setPage(p=>p-1)}
disabled={page===1}
>
Prev
</button>

<span style={{margin:"0 10px"}}>
Page {page} / {totalPages || 1}
</span>

<button
onClick={()=>setPage(p=>p+1)}
disabled={page===totalPages || totalPages===0}
>
Next
</button>

</div>

</div>

)

}