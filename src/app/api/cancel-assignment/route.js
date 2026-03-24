import db from "@/db/db";

export async function POST(req){

try{

const {requirement_id, watch_id} = await req.json();

const sellerId = req.headers.get("userid");

/* 🔒 SECURITY CHECK */

const [check] = await db.query(
"SELECT * FROM requirements WHERE id=? AND sales_person_id=?",
[requirement_id, sellerId]
);

if(check.length === 0){
return Response.json({ message: "Unauthorized" });
}

/* assignment cancel */

await db.query(
"UPDATE assignments SET status='cancelled' WHERE requirement_id=? AND watch_id=?",
[requirement_id, watch_id]
);

/* requirement वापस waiting */

await db.query(
"UPDATE requirements SET status='cancelled' WHERE id=?",
[requirement_id]
);

/* watch वापस available */

await db.query(
"UPDATE watches SET status='available' WHERE id=?",
[watch_id]
);

return Response.json({
message:"Cancelled successfully"
});

}catch(err){

console.log("Cancel Error:", err);

return Response.json({
message:"Error cancelling assignment"
});

}

}