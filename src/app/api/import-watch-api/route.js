import db from "@/db/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


const API_KEY = "BpOP9X75KXGePGBNwQqYwTeJYVPF4Y2lgfJXPhur";

const referenceFallback = {

  "rolex air king":[
  "116900",
  "126900",
  "5500"
  ],
  
  "breitling navitimer":[
  "AB0120",
  "A23322"
  ],
  
  "breitling superocean":[
  "A17320",
  "A17360"
  ],
  
  "cartier santos":[
  "WSSA0018",
  "WSSA0037"
  ],
  
  "cartier tank":[
  "W5200028",
  "WSTA0040"
  ],
  
  "tudor black bay":[
  "M79230N-0009",
  "M79230R-0012"
  ],
  
  "tudor pelagos":[
  "M25600TN-0001",
  "M25600TB-0001"
  ],
  
  "panerai luminor marina":[
  "PAM01312",
  "PAM01314"
  ],
  
  "panerai radiomir":[
  "PAM00685",
  "PAM00424"
  ]
  };

export async function GET(){

try{

const [models] = await db.query(
"SELECT * FROM models WHERE id=12 LIMIT 1"
);

if(!models.length){
return Response.json({message:"Model not found"});
}

const model = models[0];

const brandId = model.brand_id;
const modelId = model.id;

// normalize model name
let modelName = model.name.toLowerCase().trim();

console.log("Searching:", modelName);


// normal API search
let res = await fetch(
`https://api.thewatchapi.com/v1/model/search?search=${encodeURIComponent(modelName)}&search_attributes=model&api_token=${API_KEY}`
);

let data = await res.json();


// fallback for too_many_results
if(data.error && data.error.code === "too_many_results"){

console.log("Too many results, using fallback references");

// normalize again for fallback lookup
const key = modelName.replace(/\s+/g," ").trim();

const refs = referenceFallback[key] || [];

for(const ref of refs){

const refRes = await fetch(
`https://api.thewatchapi.com/v1/model/search?search=${ref}&search_attributes=reference_number&api_token=${API_KEY}`
);

const refData = await refRes.json();

if(!refData.data || !refData.data.length) continue;

const watch = refData.data[0];

const [exists] = await db.query(
"SELECT id FROM watches WHERE reference_number=?",
[watch.reference_number]
);

if(exists.length) continue;

await db.query(`
INSERT INTO watches
(reference_number,movement,year_of_production,case_material,case_diameter,description,last_updated,brand_id,model_id)
VALUES (?,?,?,?,?,?,?,?,?)
`,[
watch.reference_number,
watch.movement,
watch.year_of_production,
watch.case_material,
watch.case_diameter,
watch.description,
watch.last_updated,
brandId,
modelId
]);

return Response.json({
message:"1 watch imported",
model:model.name,
reference:watch.reference_number
});

}

return Response.json({
message:"All fallback references already imported",
model:model.name
});

}


// normal insert
if(!data.data || !data.data.length){
return Response.json({message:"No watch data"});
}

const watch = data.data[0];

const [exists] = await db.query(
"SELECT id FROM watches WHERE reference_number=?",
[watch.reference_number]
);

if(exists.length){
return Response.json({message:"Already exists"});
}

await db.query(`
INSERT INTO watches
(reference_number,movement,year_of_production,case_material,case_diameter,description,last_updated,brand_id,model_id)
VALUES (?,?,?,?,?,?,?,?,?)
`,[
watch.reference_number,
watch.movement,
watch.year_of_production,
watch.case_material,
watch.case_diameter,
watch.description,
watch.last_updated,
brandId,
modelId
]);

return Response.json({
message:"1 watch imported",
model:model.name
});

}catch(err){

return Response.json({
message:"Server error",
error:err.message
});

}

}