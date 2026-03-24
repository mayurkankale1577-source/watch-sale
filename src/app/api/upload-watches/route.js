import db from "@/db/db";
import * as XLSX from "xlsx";
import fs from "fs/promises";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req){

try{

const formData = await req.formData();

/* ================= MANUAL ================= */

const brand = formData.get("brand");

if(brand){

const model = formData.get("model");
const reference = formData.get("reference_number");
const movement = formData.get("movement");
const year = formData.get("year_of_production");
const material = formData.get("case_material");
const diameter = formData.get("case_diameter");
const description = formData.get("description");

const imageFile = formData.get("image");

/* IMAGE SAVE */
let imageName = null;

if(imageFile && imageFile.name){

const bytes = await imageFile.arrayBuffer();
const buffer = Buffer.from(bytes);

const fileName = Date.now() + "_" + imageFile.name;

await fs.writeFile(`./public/images/${fileName}`,buffer);

imageName = fileName;
}

/* BRAND */
let brandId;

const [brandData] = await db.query(
"SELECT id FROM brands WHERE name=?",
[brand]
);

if(brandData.length === 0){
  const [newBrand] = await db.query(
    "INSERT INTO brands (name) VALUES (?)",
    [brand]
  );
  brandId = newBrand.insertId;
}else{
  brandId = brandData[0].id;
}


/* MODEL */
let modelId;

const [modelData] = await db.query(
"SELECT id FROM models WHERE name=? AND brand_id=?",
[model,brandId]
);

if(modelData.length === 0){
  const [newModel] = await db.query(
    "INSERT INTO models (name,brand_id) VALUES (?,?)",
    [model,brandId]
  );
  modelId = newModel.insertId;
}else{
  modelId = modelData[0].id;
}

/* SERIAL */
const [last] = await db.query(
"SELECT serial_number FROM watches ORDER BY id DESC LIMIT 1"
);

let serial = "SN001";

if(last.length > 0 && last[0].serial_number){
const num = parseInt(last[0].serial_number.replace("SN",""));
serial = "SN" + String(num + 1).padStart(3,"0");
}

/* INSERT */
await db.query(
`INSERT INTO watches
(reference_number,serial_number,movement,year_of_production,case_material,case_diameter,description,last_updated,brand_id,model_id,image,status)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
[
reference,
serial,
movement,
year,
material,
diameter,
description,
new Date(),
brandId,
modelId,
imageName,
"available"
]
);

return Response.json({message:"Watch added"});
}

/* ================= EXCEL ================= */

const file = formData.get("file");

if(!file){
  return Response.json({message:"No file uploaded"});
}

const buffer = Buffer.from(await file.arrayBuffer());

const workbook = XLSX.read(buffer);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet,{defval:""});

for(const r of rows){

const brandName = (r["brand"] || "").trim();
const modelName = (r["model"] || "").trim();
const reference = (r["reference_number"] || "").trim();

if(!brandName || !modelName || !reference) continue;

/* ===== BRAND ===== */
let brandId;

const [brand] = await db.query(
  "SELECT id FROM brands WHERE name=?",
  [brandName]
);

if(brand.length === 0){
  const [newBrand] = await db.query(
    "INSERT INTO brands (name) VALUES (?)",
    [brandName]
  );
  brandId = newBrand.insertId;
}else{
  brandId = brand[0].id;
}

/* ===== MODEL ===== */
let modelId;

const [model] = await db.query(
  "SELECT id FROM models WHERE name=? AND brand_id=?",
  [modelName,brandId]
);

if(model.length === 0){
  const [newModel] = await db.query(
    "INSERT INTO models (name,brand_id) VALUES (?,?)",
    [modelName,brandId]
  );
  modelId = newModel.insertId;
}else{
  modelId = model[0].id;
}

/* ===== SERIAL ===== */
const [last] = await db.query(
"SELECT serial_number FROM watches ORDER BY id DESC LIMIT 1"
);

let serial = "SN001";

if(last.length > 0 && last[0].serial_number){
const num = parseInt(last[0].serial_number.replace("SN",""));
serial = "SN" + String(num + 1).padStart(3,"0");
}

/* ===== INSERT ===== */
await db.query(
`INSERT INTO watches
(reference_number,serial_number,movement,year_of_production,case_material,case_diameter,description,last_updated,brand_id,model_id,image,status)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
[
reference,
serial,
r["movement"],
r["year_of_production"],
r["case_material"],
r["case_diameter"],
r["description"],
new Date(),
brandId,
modelId,
r["image"],
"available"
]
);

}

return Response.json({message:"Upload successful"});

}catch(err){
console.log(err);
return Response.json({message:"Server error"});
}

}
