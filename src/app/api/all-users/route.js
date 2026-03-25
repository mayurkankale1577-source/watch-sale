import db from "@/db/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ================= GET USERS ================= */

export async function GET(){

try{

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({message:"Unauthorized"});
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);
const currentRole = decoded.role;

let query = "";

/* role-based access */

if(currentRole === "admin"){
query = "SELECT id,name,email,role FROM users";
}

else if(currentRole === "manager"){
query = "SELECT id,name,email,role FROM users WHERE role='sales'";
}

else{
return Response.json({message:"Access denied"});
}

const [rows] = await db.query(query);

return Response.json(rows);

}catch(err){

console.log(err);

return Response.json({message:"Server error"});

}

}


/* ================= UPDATE USER ================= */

export async function PUT(req){

try{

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({message:"Unauthorized"});
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);
const currentRole = decoded.role;

const body = await req.json();
const {id,name,email,role,password} = body;

/* role restriction */

if(currentRole === "manager" && role !== "sales"){
return Response.json({
message:"Manager can only assign sales role"
});
}

/* check duplicate email */

const [existing] = await db.query(
"SELECT id FROM users WHERE email=? AND id!=?",
[email,id]
);

if(existing.length){
return Response.json({
message:"Email already exists"
});
}

/* password update optional */

if(password && password.trim() !== ""){

if(password.length < 4){
return Response.json({
message:"Password must be at least 4 characters"
});
}

const hashed = await bcrypt.hash(password,10);

await db.query(
"UPDATE users SET name=?,email=?,role=?,password=? WHERE id=?",
[name,email,role,hashed,id]
);

}else{

await db.query(
"UPDATE users SET name=?,email=?,role=? WHERE id=?",
[name,email,role,id]
);

}

return Response.json({
message:"User updated successfully"
});

}catch(err){

console.log(err);

return Response.json({
message:"Server error"
});

}

}