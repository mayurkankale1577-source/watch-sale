import db from "@/db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req){

try{

const body = await req.json();
const {name,email,password,role,store_id} = body;

/* read token */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({message:"Unauthorized"});
}

/* decode token */

const decoded = jwt.verify(token,process.env.JWT_SECRET);
const currentRole = decoded.role;

/* store logic */

let storeId = store_id;

/* manager always own store */

if(currentRole === "manager"){
storeId = decoded.store_id;
}

/* admin user should not have store */

if(role === "admin"){
storeId = null;
}

/* role checks */

if(currentRole === "sales"){
return Response.json({
message:"Sales cannot create users"
});
}

if(currentRole === "manager" && role !== "sales"){
return Response.json({
message:"Manager can create only sales"
});
}

/* duplicate email */

const [existing] = await db.query(
"SELECT id FROM users WHERE email=?",
[email]
);

if(existing.length){
return Response.json({
message:"Email already exists"
});
}

/* hash password */

const hashedPassword = await bcrypt.hash(password,10);

/* insert user */

await db.query(
"INSERT INTO users (name,email,password,role,store_id) VALUES (?,?,?,?,?)",
[name,email,hashedPassword,role,storeId]
);

return Response.json({
message:"User created successfully"
});

}catch(error){

console.log(error);

return Response.json({
message:"Server error"
});

}

}