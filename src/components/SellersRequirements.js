"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(res => res.json());

export default function AllDetails(){

const [data,setData] = useState([]);
const [status,setStatus] = useState("");
const [search,setSearch] = useState("");

const [stats,setStats] = useState({});

const [page,setPage] = useState(1);
const [total,setTotal] = useState(0);

const limit = 10;

/* ================= TABLE DATA ================= */

const { data: res } = useSWR(
  `/api/requirements?status=${status}&page=${page}&search=${search}`,
  fetcher
  );
  
  useEffect(()=>{
  if(res){
  setData(res.data || res);
  setTotal(res.total || res.length || 0);
  }
  },[res]);

/* ================= DASHBOARD ================= */

useEffect(()=>{
fetch("/api/all-details")   // ✅ तुमने यही API बनाई है
.then(res=>{
if(!res.ok) return {};
return res.json();
})
.then(setStats)
.catch(()=>{});
},[]);

const totalPages = Math.ceil(total/limit);

return(

<div>

<h2 className="ad-title">ALL DETAILS</h2>

{/* ================= CARDS ================= */}

<div className="ad-cards">

<Card title="Customers" value={stats.customers}/>
<Card title="Sales Users" value={stats.salesUsers}/>
<Card title="Sold" value={stats.sold}/>
<Card title="Cancelled" value={stats.cancelled}/>
<Card title="Assigned" value={stats.assigned}/>
<Card title="Waiting" value={stats.waiting}/>

</div>

<h2 className="ad-title">SELLERS REQUIREMENTS</h2>
{/* ================= FILTERS ================= */}

<div className="ad-controls">

<select 
className="ad-filter"
onChange={(e)=>{
setStatus(e.target.value);
setPage(1);
}}
>
<option value="">All</option>
<option value="waiting">Waiting</option>
<option value="assigned">Assigned</option>
<option value="sold">Sold</option>
<option value="cancelled">Cancelled</option>
</select>

<input
type="text"
placeholder="Search customer..."
className="ad-search"
value={search}
onChange={(e)=>{
setSearch(e.target.value);
setPage(1);
}}
/>

</div>

{/* ================= TABLE ================= */}

<table className="ad-table">

<thead>
<tr>
<th>Customer</th>
<th>Contact</th>
<th>Brand</th>
<th>Model</th>
<th>Reference</th>
<th>Sales</th>
<th>Status</th>
<th>Serial</th>
<th>Created</th>
</tr>
</thead>

<tbody>

{data.length === 0 ? (
<tr>
<td colSpan="8" style={{textAlign:"center"}}>No Data</td>
</tr>
) : (

data.map(r=>(

<tr key={r.id}>
<td>{r.customer_name}</td>

<td>
{r.email}<br/>
{r.phone}
</td>

<td>{r.brand}</td>
<td>{r.model}</td>

<td>{r.reference_number || "ANY"}</td>

<td>{r.sales_name}</td>

<td>
<span className={`status ${r.status}`}>
{r.status}
</span>

{r.status === "waiting" && (
<div className="stock">
{r.available_count > 0 
  ? `${r.available_count} in stock` 
  : "Out of stock"}
</div>
)}

</td>
<td>
{r.serial_number ? r.serial_number : "-"}
</td>

<td>{new Date(r.created_at).toLocaleDateString()}</td>

{/* <td>
{r.assignment_status === "assigned" && r.hold_until
  ? new Date(r.hold_until).toLocaleDateString()
  : "-"
}
</td> */}

</tr>

))

)}

</tbody>

</table>

{/* ================= PAGINATION ================= */}

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
disabled={page===totalPages || totalPages===0}
>
Next
</button>

</div>

<div>
</div>



</div>

);
}

/* ================= CARD ================= */

function Card({title,value}){
return(
<div className="ad-card">
<h4>{title}</h4>
<h2>{value !== undefined ? value : "..."}</h2>
</div>
);
}