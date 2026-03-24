"use client";

import { useEffect, useState } from "react";
import UpdateCustomerForm from "@/components/UpdateCustomerForm";

export default function ClientsDetails(){

const [clients,setClients] = useState([]);
const [search,setSearch] = useState("");
const [page,setPage] = useState(1);

const [total,setTotal] = useState(0);
const limit = 10;

/* assign modal */
const [showAssign,setShowAssign] = useState(false);
const [selectedCustomer,setSelectedCustomer] = useState(null);
const [sellerId,setSellerId] = useState("");

/* edit modal */
const [showEdit,setShowEdit] = useState(false);
const [editData,setEditData] = useState(null);

const [salesUsers,setSalesUsers] = useState([]);

/* load clients */
function loadData(){
fetch(`/api/client-details?page=${page}&search=${search}`)
.then(res=>res.json())
.then(data=>{
setClients(data.data || []);
setTotal(data.total || 0);
});
}

useEffect(()=>{
loadData();
},[page,search]);

/* load sellers */
useEffect(()=>{
fetch("/api/sales-users")
.then(res=>res.json())
.then(setSalesUsers);
},[]);

const totalPages = Math.ceil(total / limit);

/* assign */
function openAssign(id){
setSelectedCustomer(id);
setShowAssign(true);
}

async function handleAssign(){

if(!sellerId){
alert("Select seller first");
return;
}

const res = await fetch("/api/assign-customer",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
customer_id:selectedCustomer,
seller_id:sellerId
})
});

const data = await res.json();
alert(data.message);

setShowAssign(false);
setSellerId("");
loadData();
}

/* edit */
function openEdit(c){
setEditData(c);
setShowEdit(true);
}

return(
<div>

<h2>ASSIGNE CLIENTS</h2>

{/* 🔍 SEARCH */}
<input
className="search"
placeholder="Search client..."
value={search}
onChange={(e)=>{
setSearch(e.target.value);
setPage(1);
}}
/>

<br/><br/>

<table className="table">

<thead>
<tr>
<th>#</th>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Address</th>
<th>Assigned</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{clients.map((c,index)=>(
<tr key={c.id}>

<td>{(page-1)*limit + index + 1}</td>

<td>{c.name}</td>
<td>{c.email}</td>
<td>{c.phone}</td>
<td>{c.address}</td>

<td>{c.seller || "Not Assigned"}</td>

<td>
<button
className="edit-btn"
onClick={()=>openEdit(c)}
>
Edit
</button>

<button
className="assign-btn"
disabled={c.assigned_to}
onClick={()=>openAssign(c.id)}
>
{c.assigned_to ? "Assigned" : "Assign To Seller"}
</button>
</td>

</tr>
))}

</tbody>

</table>

{/* 📄 PAGINATION */}
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

{/* 🔥 ASSIGN MODAL */}
{showAssign && (
<div className="modal-overlay">
<div className="modal-box-assign-seller">

<h3>Assign Seller</h3>

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

<br/><br/>

<button
className="assign-btn"
onClick={handleAssign}
>
Assign To Seller
</button>

<button
className="cross-btn"
onClick={()=>setShowAssign(false)}
style={{marginLeft:"10px"}}
>
❌
</button>

</div>
</div>
)}

{/* 🔥 EDIT MODAL */}
{showEdit && (
<div className="modal-overlay">
<div className="modal-box">

<UpdateCustomerForm
editData={editData}
onSuccess={()=>{
setShowEdit(false);
loadData();
}}
/>

<button
className="cross-btn"
onClick={()=>setShowEdit(false)}
>
❌
</button>

</div>
</div>
)}

</div>
);
}