"use client";

import { useEffect, useState } from "react";
import UpdateUserForm from "./UpdateUserForm";

export default function AllUsers(){

const [users,setUsers] = useState([]);
const [filtered,setFiltered] = useState([]);

const [search,setSearch] = useState("");
const [page,setPage] = useState(1);

const [editUser,setEditUser] = useState(null);

const perPage = 5;


/* ================= load users ================= */

useEffect(()=>{
loadUsers();
},[]);

async function loadUsers(){

const res = await fetch("/api/all-users");
const data = await res.json();

setUsers(data);
setFiltered(data);

}


/* ================= search ================= */

useEffect(()=>{

let result = users.filter(u =>
u.name.toLowerCase().includes(search.toLowerCase()) ||
u.email.toLowerCase().includes(search.toLowerCase())
);

setFiltered(result);
setPage(1);

},[search,users]);


/* ================= pagination ================= */

const totalPages = Math.ceil(filtered.length / perPage);

const start = (page-1)*perPage;
const paginated = filtered.slice(start,start+perPage);


/* ================= render ================= */

return(

<div>

<h2 className="ad-title">All Users</h2>

{/* search */}

<div className="ad-controls">

<input
className="ad-search"
placeholder="Search user..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


<table className="table">

<thead>

<tr>
<th>#</th>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{paginated.map((u,i)=>(

<tr key={u.id}>

<td>{start+i+1}</td>
<td>{u.name}</td>
<td>{u.email}</td>
<td>{u.role}</td>

<td>

<button
className="table-btn"
onClick={()=>setEditUser(u)}
>
Edit
</button>

</td>

</tr>

))}

{paginated.length === 0 && (

<tr>
<td colSpan="5">No Data</td>
</tr>

)}

</tbody>

</table>


{/* ================= pagination ================= */}

<div className="ad-pagination">

<button
disabled={page===1}
onClick={()=>setPage(page-1)}
>
Prev
</button>

{Array.from({length:totalPages},(_,i)=>(
<button
key={i}
className={page===i+1 ? "active" : ""}
onClick={()=>setPage(i+1)}
>
{i+1}
</button>
))}

<button
disabled={page===totalPages}
onClick={()=>setPage(page+1)}
>
Next
</button>

</div>


{/* ================= popup ================= */}

{editUser && (

<UpdateUserForm
user={editUser}
onClose={()=>setEditUser(null)}
onUpdated={loadUsers}
/>

)}

</div>

)

}