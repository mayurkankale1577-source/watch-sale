import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req){

try{

const {requirement_id,watch_id} = await req.json();

/* 🔒 CHECK watch available */

const [[watch]] = await db.query(
"SELECT status FROM watches WHERE id=?",
[watch_id]
);

if(!watch || watch.status !== "available"){
return Response.json({
message:"Watch not available"
});
}

/* insert assignment */

await db.query(
`INSERT INTO assignments 
(requirement_id,watch_id,assigned_at,hold_until,status)
VALUES (?,?,NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'assigned')`,
[requirement_id,watch_id]
);

/* update requirement */

await db.query(
"UPDATE requirements SET status='assigned' WHERE id=?",
[requirement_id]
);

/* update watch */

await db.query(
"UPDATE watches SET status='assigned' WHERE id=?",
[watch_id]
);

return Response.json({
message:"Watch assigned successfully"
});

}catch(err){

console.log(err);

return Response.json({
message:"Error assigning watch"
});

}
}