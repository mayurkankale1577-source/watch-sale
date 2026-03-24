import db from "@/db/db";

export async function GET(){

    const [rows] = await db.query(
    "SELECT id,name FROM customers"
    );
    
    return Response.json(rows);
    
    }

export async function POST(req){

const body = await req.json();

const {
name,
email,
phone,
address,
assigned_to,
created_by   // ⭐ add this
} = body;

/* 🔒 CHECK duplicate phone */

const [existing] = await db.query(
    "SELECT id FROM customers WHERE phone=?",
    [phone]
    );
    
    if(existing.length > 0){
    return Response.json({
    message:"Customer with this phone already exists"
    });
    }

await db.query(
`INSERT INTO customers
(name,email,phone,address,assigned_to,created_by)
VALUES (?,?,?,?,?,?)`,
[name,email,phone,address,assigned_to,created_by]
);

return Response.json({
message:"Customer added"
})

}

/* 🔒update client */

export async function PUT(req){

    const body = await req.json();
    
    await db.query(`
    UPDATE customers
    SET name=?, email=?, phone=?, address=?, assigned_to=?
    WHERE id=?
    `,[
    body.name,
    body.email,
    body.phone,
    body.address,
    body.assigned_to,
    body.id
    ]);
    
    return Response.json({
    message:"Customer updated"
    });
    
    }