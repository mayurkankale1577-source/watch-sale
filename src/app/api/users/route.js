import db from "@/db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req){

try{

const body = await req.json();
const {name,email,password,role} = body;

/* read token */

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({message:"Unauthorized"});
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);
const currentRole = decoded.role;

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
"INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
[name,email,hashedPassword,role]
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