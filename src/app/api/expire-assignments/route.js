import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(){

try{

const [rows] = await db.query(`
SELECT * FROM assignments
WHERE status='assigned' AND hold_until < NOW()
`);

for(const row of rows){

await db.query(
"UPDATE assignments SET status='expired' WHERE id=?",
[row.id]
);

await db.query(
"UPDATE watches SET status='available' WHERE id=?",
[row.watch_id]
);

await db.query(
"UPDATE requirements SET status='waiting' WHERE id=?",
[row.requirement_id]
);

}

return Response.json({
message:"Expired assignments handled"
});

}catch(err){

console.log(err);

return Response.json({
message:"Error"
});

}

}