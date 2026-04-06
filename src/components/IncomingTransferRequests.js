"use client";

import { useEffect, useState } from "react";

export default function IncomingTransferRequests(){

const [data,setData] = useState([]);

useEffect(()=>{
loadData();
},[]);

function loadData(){
fetch("/api/incoming-transfer-requests")
.then(res=>res.json())
.then(setData)
.catch(()=>setData([]));
}

/* ================= APPROVE ================= */

async function approve(r){

await fetch("/api/approve-transfer",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
transfer_id:r.id,
watch_id:r.watch_id,
to_store:r.to_store
})
});

alert("Transfer Approved");

loadData();

}

/* ================= REJECT ================= */

async function reject(r){

await fetch("/api/reject-transfer",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
transfer_id:r.id
})
});

alert("Transfer Rejected");

loadData();

}

return(

<div>

<h2>INCOMING TRANSFER REQUESTS</h2>

<table className="table">

<thead>
<tr>
<th>Watch</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{data.length === 0 ? (

<tr>
<td colSpan="2" style={{textAlign:"center"}}>
No Incoming Requests
</td>
</tr>

) : (

data.map(r=>(

<tr key={r.id}>

<td>{r.model}</td>

<td>

<button 
onClick={()=>approve(r)}
className="table-btn"
>
Approve
</button>

<button 
onClick={()=>reject(r)}
className="table-btn"
style={{marginLeft:"10px"}}
>
Reject
</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

);

}