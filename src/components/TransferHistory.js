"use client";

import { useEffect, useState } from "react";

export default function TransferHistory(){

const [data,setData] = useState([]);

useEffect(()=>{

fetch("/api/transfer-history")
.then(res=>res.json())
.then(setData);

},[]);

return(

<div className="content">

<h2>TRANSFER HISTORY</h2>

<table className="table">

<thead>
<tr>
<th>Watch</th>
<th>From</th>
<th>To</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{data.map(r=>(

<tr key={r.id}>

<td>{r.model}</td>
<td>{r.from_store}</td>
<td>{r.to_store}</td>

<td>
<span className={`status ${r.status}`}>
{r.status}
</span>
</td>

</tr>

))}

</tbody>

</table>

</div>

);

}