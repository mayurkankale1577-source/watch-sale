import db from "@/db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req){

try{

const body = await req.json();
const {email,password} = body;

const [rows] = await db.query(
"SELECT * FROM users WHERE email=?",
[email]
);

if(rows.length === 0){
return NextResponse.json({
success:false,
message:"User not found"
});
}

const user = rows[0];

const match = await bcrypt.compare(password,user.password);

if(!match){
return NextResponse.json({
success:false,
message:"Invalid password"
});
}

/* create token */

const token = jwt.sign(
  {
  id:user.id,
  role:user.role,
  name:user.name   // ⭐ यह add करना जरूरी है
  },
  process.env.JWT_SECRET,
  {expiresIn:"1d"}
  );

/* response */

const response = NextResponse.json({
success:true,
user:{
id:user.id,
name:user.name,
role:user.role
}
});

/* set cookie */

response.cookies.set("token",token,{
httpOnly:true,
secure:false,
sameSite:"strict",
path:"/",
maxAge:60*60*24
});

return response;

}catch(err){

console.log(err);

return NextResponse.json({
success:false,
message:"Server error"
});

}

}