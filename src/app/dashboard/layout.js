"use client";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "@/app/styles/dashboard.css";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaBoxOpen,
  FaHistory,
  FaUserCircle
  } from "react-icons/fa";

export default function DashboardLayout({ children }) {
const [sidebarOpen,setSidebarOpen] = useState(false);
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
<button
className="menu-toggle"
onClick={()=>setSidebarOpen(!sidebarOpen)}
>

{sidebarOpen ? <FaTimes /> : <FaBars />}

</button>

<div className="dashboard-layout">

{/* SIDEBAR */}

<div className={`sidebar ${sidebarOpen ? "active" : ""}`}>

<img
className="logo-img"
src="/images/patekphilippe-header-logo.jpg"
/>

<nav className="sidebar-nav">

<Link
href="/dashboard"
className={pathname === "/dashboard" ? "active" : ""}
>
<FaTachometerAlt className="menu-icon" />
Dashboard
</Link>


{(role === "admin" || role === "manager") && (

<Link
href="/dashboard/create-user"
className={pathname === "/dashboard/create-user" ? "active" : ""}
>
<FaUsers className="menu-icon" />
Create Sales User
</Link>

)}

<Link
href="/dashboard/add-customer"
className={pathname === "/dashboard/add-customer" ? "active" : ""}
>
<FaUserPlus className="menu-icon" />
Add Client
</Link>

<Link
href="/dashboard/brand-details"
className={pathname === "/dashboard/brand-details" ? "active" : ""}
>
<FaBoxOpen className="menu-icon" />
Catalog Details
</Link>

<Link
href="/dashboard/upload-watches"
className={pathname === "/dashboard/upload-watches" ? "active" : ""}
>
<FaBoxOpen className="menu-icon" />
Update Stock
</Link>

<Link
href="/dashboard/transfer-history"
className={pathname === "/dashboard/transfer-history" ? "active" : ""}
>
<FaHistory className="menu-icon" />
Transfer History
</Link>

<Link
href="/dashboard/my-profile"
className={pathname === "/dashboard/my-profile" ? "active" : ""}
>
<FaUserCircle className="menu-icon" />
My Profile
</Link>
</nav>



</div>


{/* MAIN AREA */}

<div className="main-area">

<div className="topbar-header">

<div className="sidebar-user">

<h3>Welcome {name}</h3>

<h2 style={{textTransform:"uppercase"}}>{role} DASHBOARD</h2>

<button
className="logout"
onClick={logout}
>
Logout
</button>

</div>


</div>

<div className="page-content">

{children}

</div>

</div>

</div>

{/* <div>
{children}
</div> */}

</div>

)

}