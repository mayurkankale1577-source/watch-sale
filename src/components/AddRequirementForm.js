"use client";

import { useState, useEffect } from "react";

export default function AddRequirementForm({ customer, sellerId, closeModal }) {

const [watches, setWatches] = useState([]);
const [watchId, setWatchId] = useState("");

useEffect(() => {

fetch("/api/watches")
.then(res => res.json())
.then(data => setWatches(data));

}, []);


async function addRequirement(e) {

e.preventDefault();

const res = await fetch("/api/requirements", {
method: "POST",
headers: { "Content-Type": "application/json" },

body: JSON.stringify({
customer_id: customer.id,
watch_id: watchId,
sales_person_id: sellerId
})
});

const data = await res.json();

alert(data.message);

closeModal();

}


return (

<div>

<h3>Add Requirement</h3>

<p><b>Customer:</b> {customer.name}</p>

<form onSubmit={addRequirement}>

<select
className="modal-input"
value={watchId}
onChange={(e) => setWatchId(e.target.value)}
required
>

<option value="">Select Watch</option>

{watches.map((w) => (

<option key={w.id} value={w.id}>
{w.brand} {w.model}
</option>

))}

</select>

<button className="modal-button">
Add Requirement
</button>

</form>

</div>

);

}