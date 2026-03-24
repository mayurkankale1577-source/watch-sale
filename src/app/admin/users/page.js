"use client";

import { useState } from "react";

export default function UsersPage(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function createUser(e){
    e.preventDefault();

    const res = await fetch("/api/users",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        name,
        email,
        password,
        role:"sales"
      })
    });

    const data = await res.json();

    alert(data.message);
  }

  return(

    <div>

      <h1>Create Sales User</h1>

      <form onSubmit={createUser}>

        <input
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
        />

        <br/><br/>

        <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button>Create User</button>

      </form>

    </div>

  )

}