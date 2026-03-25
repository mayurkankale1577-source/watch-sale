export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import db from "@/db/db";
import * as XLSX from "xlsx";

export async function GET(){

try{

const [rows] = await db.query(`
SELECT 
b.name as brand,
m.name as model,
w.reference_number,
w.movement,
w.year_of_production,
w.case_material,
w.case_diameter,
w.description,
w.image
FROM watches w
JOIN brands b ON w.brand_id=b.id
JOIN models m ON w.model_id=m.id
GROUP BY w.reference_number
`);

const worksheet = XLSX.utils.json_to_sheet(rows);

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook,worksheet,"Watches");

const buffer = XLSX.write(workbook,{
type:"buffer",
bookType:"xlsx"
});

return new Response(buffer,{
headers:{
"Content-Disposition":"attachment; filename=catalog.xlsx",
"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
});

}catch(err){

console.error("Download Error:",err);

return new Response(
JSON.stringify({error:"Failed to download file"}),
{status:500}
);

}

}