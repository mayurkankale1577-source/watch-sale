"use client";

import { useEffect, useState } from "react";

export default function TransferRequests(){

const [requests,setRequests] = useState([]);

useEffect(()=>{
fetch("/api/my-transfer-requests")
.then(res=>res.json())
.then(setRequests);
},[]);

return(

<div>

{requests.length > 0 && (

<>
<h2>TRANSFER REQUESTS</h2>

<table className="table">
<thead>
<tr>
<th>Watch</th>
<th>From Store</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{requests.map(r => (

<tr key={r.id}>
<td>{r.model}</td>
<td>{r.from_store}</td>
<td>

<td>

{r.status === "pending" && (
<span className="status pending">Pending</span>
)}

{r.status === "transferred" && (
<span className="status received">Received</span>
)}

{r.status === "rejected" && (
<span className="status rejected">Rejected</span>
)}

</td>

</td>
</tr>

))}

</tbody>
</table>

</>

)}

</div>

);

}