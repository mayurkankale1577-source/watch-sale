"use client";

import { useEffect, useState } from "react";

export default function Watches(){

const [watches,setWatches] = useState([]);

useEffect(()=>{

fetch("/api/watches")
.then(res=>res.json())
.then(data=>setWatches(data));

},[]);

return(
    <div className="content">

<div className="table-box">

<h3>Available stocks</h3>

<table className="table">

<thead>
<tr>
<th>Brand</th>
<th>Model</th>
<th>Reference</th>
<th>Movement</th>
<th>Material</th>
<th>Diameter</th>
<th>Stock</th>
</tr>
</thead>

<tbody>

{watches.map(w=>(
<tr key={w.id}>
<td>{w.brand}</td>
<td>{w.model}</td>
<td>{w.reference_number}</td>
<td>{w.movement}</td>
<td>{w.case_material}</td>
<td>{w.case_diameter}</td>
<td>{w.stock}</td>
</tr>
))}

</tbody>

</table>

</div>

</div>

)

}