import db from "@/db/db";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req){

try{

const body = await req.json();

const { email } = body;


/* CHECK USER */

const [rows] = await db.query(
"SELECT * FROM users WHERE email=?",
[email]
);

if(rows.length === 0){

return NextResponse.json({
success:false,
message:"Email not found"
});

}

const user = rows[0];


/* GENERATE TOKEN */

const token = crypto.randomBytes(32).toString("hex");


/* TOKEN EXPIRY */

const expiry = Date.now() + 1000 * 60 * 15;


/* SAVE TOKEN */

await db.query(
`UPDATE users
SET reset_token=?,
reset_token_expiry=?
WHERE id=?`,
[token,expiry,user.id]
);


/* RESET LINK */

const resetLink =
`${process.env.NEXT_PUBLIC_BASE_URL}/reset-login-password?token=${token}`;
/* NODEMAILER */

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS
}

});


/* SEND MAIL */

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:email,

subject:"Reset Password",

html:`

<h2>Password Reset</h2>

<p>Click below link to reset your password:</p>

<a href="${resetLink}">
Reset Password
</a>

<p>Link expires in 15 minutes.</p>

`

});


return NextResponse.json({
success:true,
message:"Reset link sent to email"
});

}catch(err){

console.log(err);

return NextResponse.json({
success:false,
message:"Server error"
});

}

}