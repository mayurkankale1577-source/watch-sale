import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req){

const body = await req.json();
const {customer_id,seller_id} = body;

/* check already assigned */

const [existing] = await db.query(
"SELECT assigned_to FROM customers WHERE id=?",
[customer_id]
);

if(existing[0].assigned_to){
return Response.json({
message:"Customer already assigned"
});
}

/* assign seller */

await db.query(
"UPDATE customers SET assigned_to=? WHERE id=?",
[seller_id,customer_id]
);

return Response.json({
message:"Customer assigned successfully"
});

}