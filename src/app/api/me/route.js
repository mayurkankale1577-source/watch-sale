import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(){

try{

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

if(!token){
return Response.json({ user:null });
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);

return Response.json({
user:{
id:decoded.id,
role:decoded.role,
name:decoded.name
}
});

}catch(err){

console.log(err);

return Response.json({ user:null });

}

}