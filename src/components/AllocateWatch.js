"use client";

import { useEffect, useState } from "react";

export default function AllocateWatch(){

const [requirements,setRequirements] = useState([]);
const [watches,setWatches] = useState([]);
const [selectedReq,setSelectedReq] = useState(null);
const [message,setMessage] = useState("");
const [filterSeller,setFilterSeller] = useState("");
const [showModal,setShowModal] = useState(false);
const [sellers,setSellers] = useState([]);


useEffect(()=>{
    fetch("/api/sales-users")
    .then(res=>res.json())
    .then(setSellers);
    },[]);

/* pagination */
const [page,setPage] = useState(1);
const [total,setTotal] = useState(0);
const perPage = 10;

/* ================= LOAD DATA ================= */

useEffect(()=>{

let url = `/api/requirements?status=waiting&page=${page}`;

if(filterSeller){
url += `&seller=${filterSeller}`;
}

fetch(url)
.then(res=>res.json())
.then(res=>{
setRequirements(res.data || []);
setTotal(res.total || 0);
});

},[page,filterSeller]);

/* ================= LOAD WATCHES ================= */

async function loadWatches(req){

setSelectedReq(req);
setShowModal(true);

const res = await fetch(
`/api/watches?model_id=${req.model_id}&reference=${req.reference_number}`
);

const data = await res.json();
setWatches(data);
}

/* ================= ASSIGN ================= */

async function assignWatch(watchId){

const res = await fetch("/api/assign-watch",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
requirement_id:selectedReq.id,
watch_id:watchId
})
});

let data = {};

try{
data = await res.json();
}catch{
data = {message:"Server error"};
}

setMessage(data.message);

/* reset */

setShowModal(false);
setSelectedReq(null);
setWatches([]);

/* reload */

let url = `/api/requirements?status=waiting&page=${page}`;

if(filterSeller){
url += `&seller=${filterSeller}`;
}

fetch(url)
.then(res=>res.json())
.then(res=>{
setRequirements(res.data || []);
setTotal(res.total || 0);
});
}

/* ================= PAGINATION ================= */

const totalPages = Math.ceil(total / perPage) || 1;

return(

<div>

<h2>ALLOCATE WATCH</h2>

{message && <p className="success-msg">{message}</p>}

 

<select 
value={filterSeller}
onChange={(e)=>{
setFilterSeller(e.target.value);
setPage(1);
}}
style={{marginBottom:"15px",padding:"10px",marginTop:"15px"}}
>
<option value="">All Sellers</option>

{sellers.map(s=>(
<option key={s.id} value={s.id}>
{s.name}
</option>
))}

</select>

 

<table className="table">

<thead>
<tr>
<th>Customer</th>
<th>Brand</th>
<th>Model</th>
<th>Reference</th>
<th>Sales</th>
<th>Date</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{requirements.length === 0 ? (
<tr>
<td colSpan="7" style={{textAlign:"center"}}>No Data</td>
</tr>
) : (

requirements.map(r=>(

<tr key={r.id}>

<td>{r.customer_name}</td>
<td>{r.brand}</td>
<td>{r.model}</td>
<td>{r.reference_number || "ANY"}</td>
<td>{r.sales_name}</td>

<td>
{r.created_at 
? new Date(r.created_at).toLocaleString() 
: "-"}
</td>

<td>
<button 
onClick={()=>loadWatches(r)}
disabled={r.available_count === 0}
style={{
background: r.available_count === 0 ? "#ccc" : "#000",
color: "#fff",
padding: "9px 15px",
cursor: r.available_count === 0 ? "not-allowed" : "pointer",
border: "none",
borderRadius: "4px"
}}
>
Allocate Watch
</button>
</td>

</tr>

))

)}

</tbody>

</table>

 

<div className="aw-pagination">

<button 
onClick={()=>setPage(page-1)} 
disabled={page===1}
>
Prev
</button>

{Array.from({length: totalPages}, (_, i)=>(

<button
key={i}
className={page === i+1 ? "active" : ""}
onClick={()=>setPage(i+1)}
>
{i+1}
</button>

))}

<button 
onClick={()=>setPage(page+1)}
disabled={page===totalPages}
>
Next
</button>

</div>

 
{showModal && (

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"#fff",
padding:"20px",
width:"600px",
borderRadius:"8px",
position:"relative"
}}>

<h3>Select Watch</h3>

<table className="table">

<thead>
<tr>
<th>Reference</th>
<th>Serial</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{watches.length === 0 ? (

<tr>
<td colSpan="3" style={{textAlign:"center"}}>
No available watches
</td>
</tr>

) : (

watches.map(w=>(

<tr key={w.id}>

<td>{w.reference_number}</td>
<td>{w.serial_number}</td>

<td>
<button onClick={()=>assignWatch(w.id)}>
Allocate Watch
</button>
</td>

</tr>

))

)}

</tbody>

</table>

<button 
onClick={()=>setShowModal(false)}
style={{
position:"absolute",
top:"10px",
right:"10px"
}}
>
❌
</button>

</div>

</div>

)}

</div>
);
}