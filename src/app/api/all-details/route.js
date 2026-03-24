import db from "@/db/db";

export async function GET(){

try{

const [[customers]] = await db.query(`SELECT COUNT(*) as total FROM customers`);
const [[salesUsers]] = await db.query(`SELECT COUNT(*) as total FROM users WHERE role='sales'`);

const [[sold]] = await db.query(`SELECT COUNT(*) as total FROM requirements WHERE status='sold'`);
const [[cancelled]] = await db.query(`SELECT COUNT(*) as total FROM requirements WHERE status='cancelled'`);
const [[assigned]] = await db.query(`SELECT COUNT(*) as total FROM requirements WHERE status='assigned'`);
const [[waiting]] = await db.query(`SELECT COUNT(*) as total FROM requirements WHERE status='waiting'`);

return Response.json({
customers: customers.total,
salesUsers: salesUsers.total,
sold: sold.total,
cancelled: cancelled.total,
assigned: assigned.total,
waiting: waiting.total
});

}catch(err){
return Response.json({error:"server error"});
}

}