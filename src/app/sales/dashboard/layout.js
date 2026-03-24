"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "@/app/styles/dashboard.css";

export default function SalesLayout({ children }) {

const [userName,setUserName] = useState("");

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

await fetch("/api/logout",{ method:"POST" });

router.replace("/login");   // ⭐ push की जगह replace

}

return(

<div>

<header className="header">

<img
className="logo-img"
src="/images/patekphilippe-header-logo.jpg"
/>

<nav className="nav">

<Link
href="/sales/dashboard"
className={pathname === "/sales/dashboard" ? "active" : ""}
>
DASHBOARD
</Link>

{/* <Link
href="/sales/dashboard/my-customers"
className={pathname === "/sales/dashboard/my-customers" ? "active" : ""}
>
MY CLIENT
</Link> */}

<Link
href="/sales/dashboard/watches"
className={pathname === "/sales/dashboard/watches" ? "active" : ""}
>
AVAILABLE STOCKS
</Link>

{/* <Link
href="/sales/dashboard/add-requirement"
className={pathname === "/sales/dashboard/add-requirement" ? "active" : ""}
>
ADD REQUIREMENT
</Link> */}

<Link
href="/sales/dashboard/requirements"
className={pathname === "/sales/dashboard/requirements" ? "active" : ""}
>
MY REQUEST
</Link>

</nav>

<div className="user-box">

<h2>SALES DASHBOARD</h2>

<p className="user-name">
Welcome {userName}
</p>

<button
className="logout"
onClick={logout}
>
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