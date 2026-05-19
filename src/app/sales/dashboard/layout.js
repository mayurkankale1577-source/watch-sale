"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";

import {
FaTachometerAlt,
FaBoxOpen,
FaUser
} from "react-icons/fa";

import "@/app/styles/dashboard.css";

export default function SalesLayout({ children }) {

const [userName,setUserName] = useState("");
const [sidebarOpen,setSidebarOpen] = useState(false);

const router = useRouter();
const pathname = usePathname();

const [loading,setLoading] = useState(true);

useEffect(()=>{

fetch("/api/me")
.then(res=>res.json())
.then(data=>{

if(!data.user){

router.replace("/login");
return;

}

setUserName(data.user.name);

setLoading(false);

});

},[]);

if(loading){
return null;
}

async function logout(){

await fetch("/api/logout",{
method:"POST"
});

router.replace("/login");

}

return(

<div className="dashboard-layout">

{/* MOBILE MENU BUTTON */}

<button
className="menu-btn"
onClick={()=>setSidebarOpen(!sidebarOpen)}
>

{sidebarOpen ? "✕" : <FaBars />}

</button>


{/* SIDEBAR */}

<div className={`sidebar ${sidebarOpen ? "show-sidebar" : ""}`}>

<img
className="logo-img"
src="/images/patekphilippe-header-logo.jpg"
/>

<nav className="sidebar-nav">

<Link
href="/sales/dashboard"
className={pathname === "/sales/dashboard" ? "active" : ""}
onClick={()=>setSidebarOpen(false)}
>

<FaTachometerAlt />

Dashboard

</Link>


<Link
href="/sales/dashboard/watches"
className={pathname === "/sales/dashboard/watches" ? "active" : ""}
onClick={()=>setSidebarOpen(false)}
>

<FaBoxOpen />

Available Stocks

</Link>


<Link
href="/sales/dashboard/my-profile"
className={pathname === "/sales/dashboard/my-profile" ? "active" : ""}
onClick={()=>setSidebarOpen(false)}
>

<FaUser />

My Profile

</Link>

</nav>

</div>


{/* MAIN AREA */}

<div className="main-area">

<div className="topbar">

<h2>
SALES DASHBOARD
</h2>

<div className="sidebar-user">

<h3>{userName}</h3>

<p>Sales User</p>

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

);

}