import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req){

const token = req.cookies.get("token")?.value;

if(!token){
return NextResponse.redirect(new URL("/login",req.url));
}

try{

const decoded = jwt.verify(token,process.env.JWT_SECRET);

if(req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin" && decoded.role !== "manager"){
return NextResponse.redirect(new URL("/login",req.url));
}

if(req.nextUrl.pathname.startsWith("/sales") && decoded.role !== "sales"){
return NextResponse.redirect(new URL("/login",req.url));
}

return NextResponse.next();

}catch{

return NextResponse.redirect(new URL("/login",req.url));

}

}

export const config = {
matcher:[
"/admin/:path*",
"/sales/:path*"
]
};