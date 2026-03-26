import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "@/db/db";

export async function GET(){

try{

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({ user:null });
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);

/* email DB se lao */

const [rows] = await db.query(
"SELECT email FROM users WHERE id=?",
[decoded.id]
);

return Response.json({
user:{
id:decoded.id,
role:decoded.role,
name:decoded.name,
email: rows[0]?.email || ""
}
});

}catch(err){

console.log(err);

return Response.json({ user:null });

}

}