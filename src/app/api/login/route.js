import db from "@/db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req){

try{

const body = await req.json();
const {
  email,
  password,
  captchaToken
  } = body;

/* CAPTCHA VERIFY */

if(!captchaToken){

  return NextResponse.json({
  success:false,
  message:"Captcha required"
  });
  
  }
  
  const verifyURL =
  `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
  
  const captchaRes = await fetch(verifyURL,{
  method:"POST"
  });
  
  const captchaData = await captchaRes.json();
  
  if(!captchaData.success){
  
  return NextResponse.json({
  success:false,
  message:"Captcha failed"
  });
  
  }


  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
    );
    
    console.log("ROWS:", rows);
    
    if(rows.length === 0){
    
    console.log("USER NOT FOUND");
    
    return NextResponse.json({
    success:false,
    message:"User not found"
    });
    }
    
    const user = rows[0];
    
    console.log("DB PASSWORD:", user.password);
    console.log("ENTERED PASSWORD:", password);
    
    const match = await bcrypt.compare(password,user.password);
    
    console.log("MATCH:", match);
    
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
  name:user.name,
  store_id:user.store_id
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
  role:user.role,
  store_id:user.store_id
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