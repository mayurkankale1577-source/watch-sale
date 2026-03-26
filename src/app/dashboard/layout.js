"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "@/app/styles/dashboard.css";

export default function DashboardLayout({ children }) {

const [name,setName] = useState("");
const [role,setRole] = useState("");

const router = useRouter();
const pathname = usePathname();
const [loading,setLoading] = useState(true);

useEffect(()=>{

  fetch("/api/me")
  .then(res=>res.json())
  .then(data=>{
  
  if(!data.user){
  router.replace("/login");   // ⭐ यह add करो
  return;
  }
  
  setName(data.user.name);
  setRole(data.user.role);
  setLoading(false);
  
  });
  
  },[]);
  
  if(loading){
  return null;
  }

  async function logout(){

    await fetch("/api/logout",{ method:"POST" });
    
    router.replace("/login");
    
    }

return(

<div>

<header className="header">

<img className="logo-img" src="/images/patekphilippe-header-logo.jpg"/>

<nav className="nav">


<Link
href="/dashboard"
className={pathname === "/dashboard" ? "active" : ""}
>
DASHBOARD
</Link>

{/* Admin & Manager */}
{(role === "admin" || role === "manager") && (



<Link
href="/dashboard/create-user"
className={pathname === "/dashboard/create-user" ? "active" : ""}
>
CREATE SALES USER
</Link>

)}

<Link
href="/dashboard/add-customer"
className={pathname === "/dashboard/add-customer" ? "active" : ""}
>
ADD CLIENT
</Link>


<Link
href="/dashboard/brand-details"
className={pathname === "/dashboard/brand-details" ? "active" : ""}
>
CATALOG DETAILS
</Link>

<Link
href="/dashboard/upload-watches"
className={pathname === "/dashboard/upload-watches" ? "active" : ""}
>
UPDATE STOCK
</Link>


{/* <Link
href="/admin/dashboard/assign-customer"
className={pathname === "/admin/dashboard/assign-customer" ? "active" : ""}
>
ASSIGN CLIENT
</Link> */}

<Link
href="/dashboard/my-profile"
className={pathname === "/dashboard/my-profile" ? "active" : ""}
>
MY PROFILE
</Link>
 
 

</nav>

<div className="admin-box">

<h2>{role.toUpperCase()} DASHBOARD</h2>

<p className="admin-name">
Welcome {name}
</p>

<button className="logout" onClick={logout}>
Logout
</button>

</div>

</header>

<div>
{children}
</div>

</div>

)

}