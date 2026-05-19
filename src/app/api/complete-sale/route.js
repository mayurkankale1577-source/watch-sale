import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req){

try{

const body = await req.json();

const {
requirement_id,
watch_id,
customer_id
} = body;

const sellerId = req.headers.get("userid");

const [check] = await db.query(
    "SELECT * FROM requirements WHERE id=? AND sales_person_id=?",
    [requirement_id, sellerId]
    );
    
    if(check.length === 0){
    return Response.json({ message: "Unauthorized" });
    }

/* 1️⃣ sales entry */

await db.query(

`INSERT INTO sales
(customer_id, watch_id, sales_person_id)
VALUES (?,?,?)`,

[customer_id, watch_id, sellerId]

);

/* 2️⃣ requirement status */

await db.query(
"UPDATE requirements SET status='sold' WHERE id=?",
[requirement_id]
);

/* 3️⃣ watch status */

await db.query(
"UPDATE watches SET status='sold' WHERE id=?",
[watch_id]
);

/* 4️⃣ assignment status */

await db.query(
    "UPDATE assignments SET status='completed' WHERE requirement_id=? AND watch_id=?",
    [requirement_id, watch_id]
    );

return Response.json({
message:"Sale completed successfully"
});

}catch(err){

console.log(err);

return Response.json({
message:"Error completing sale"
});

}

}