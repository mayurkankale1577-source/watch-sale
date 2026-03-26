"use client";

import { useEffect, useState } from "react";
import EditMyProfile from "./EditMyProfile";

export default function MyProfile(){

const [user,setUser] = useState(null);
const [editing,setEditing] = useState(false);

useEffect(()=>{

fetch("/api/me")
.then(res=>res.json())
.then(data=>{
if(data.user){
setUser(data.user);
}
});

},[]);

if(!user) return <p>Loading...</p>;

return(

<div className="content">

<h2 className="page-title">MY PROFILE</h2>

<table className="table">

<tbody>

<tr>
<th>Name</th>
<td>{user.name}</td>
</tr>

<tr>
<th>Email</th>
<td>{user.email}</td>
</tr>

<tr>
<th>Role</th>
<td>{user.role}</td>
</tr>

</tbody>

</table>

<button
className="btn"
onClick={()=>setEditing(true)}
>
Edit Profile
</button>

{editing && (
<EditMyProfile
user={user}
onClose={()=>setEditing(false)}
onUpdated={(updated)=>{
setUser(updated);
setEditing(false);
}}
/>
)}

</div>

);

}