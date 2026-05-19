import db from "@/db/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


/* ================= UPDATE PROFILE ================= */

export async function PUT(req){

try{

const body = await req.json();
const { name, email, password } = body;

/* token read */

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({
success:false,
message:"Unauthorized"
});
}

/* decode token */

const decoded = jwt.verify(token, process.env.JWT_SECRET);
const userId = decoded.id;


/* password update check */

if(password && password.trim() !== ""){

const hashed = await bcrypt.hash(password,10);

await db.query(
"UPDATE users SET name=?, email=?, password=? WHERE id=?",
[name, email, hashed, userId]
);

}else{

await db.query(
"UPDATE users SET name=?, email=? WHERE id=?",
[name, email, userId]
);

}

return Response.json({
success:true,
message:"Profile updated successfully"
});

}catch(err){

console.log("Profile Update Error:",err);

return Response.json({
success:false,
message:"Server error"
});

}

}