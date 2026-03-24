import db from "@/db/db";

const API_KEY = "v6LcY5GdmeIkd637w5m3cJZYjDElRrnrotbU3yCt";

export async function GET(){

let total = 0;
const BRAND = "Piaget";
const BRAND_DB_NAME = "Piaget";
const MAX_MODELS = 5;

try{

// get brand id
const [brandRow] = await db.query(
"SELECT id FROM brands WHERE name=?",
[BRAND_DB_NAME]
);

if(!brandRow.length){
return Response.json({message:"Brand not found"});
}

const brandId = brandRow[0].id;


//  fetch models
const res = await fetch(
`https://api.thewatchapi.com/v1/model/list?brand=${BRAND}&api_token=${API_KEY}`
);

const apiData = await res.json();

if(apiData.error){
return Response.json({
message:"API error",
error:apiData.error
});
}


//  remove blank + limit 5
let models = [];

for(const m of apiData.data){

if(!m || m.trim() === "") continue;

models.push(m);

if(models.length === MAX_MODELS) break;

}


//  insert models
for(const modelName of models){

const [exists] = await db.query(
"SELECT id FROM models WHERE name=?",
[modelName]
);

if(exists.length) continue;

await db.query(
"INSERT INTO models (brand_id,name) VALUES (?,?)",
[brandId,modelName]
);

total++;

}

return Response.json({
message:`${total} Longines models imported`
});

}catch(err){

return Response.json({
message:"Server error",
error:err.message
});

}

}