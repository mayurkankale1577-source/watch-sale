import db from "@/db/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req){

try{

const body = await req.json();

const {
token,
password
} = body;


/* VALIDATION */

if(!password || password.length < 4){

return NextResponse.json({
success:false,
message:"Password must be at least 4 characters"
});

}


/* CHECK TOKEN */

const [rows] = await db.query(
`SELECT * FROM users
WHERE reset_token=?`,
[token]
);

if(rows.length === 0){

return NextResponse.json({
success:false,
message:"Invalid token"
});

}

const user = rows[0];


/* CHECK EXPIRY */

if(Date.now() > user.reset_token_expiry){

return NextResponse.json({
success:false,
message:"Token expired"
});

}


/* HASH PASSWORD */

const hashedPassword =
await bcrypt.hash(password,10);


/* UPDATE PASSWORD */

await db.query(
`UPDATE users
SET password=?,
reset_token=NULL,
reset_token_expiry=NULL
WHERE id=?`,
[
hashedPassword,
user.id
]
);


/* SUCCESS */

return NextResponse.json({
success:true,
message:"Password reset successful"
});

}catch(err){

console.log(err);

return NextResponse.json({
success:false,
message:"Server error"
});

}

}