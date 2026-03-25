"use client";

import { useState } from "react";

export default function UploadWatches(){

const [file,setFile] = useState(null);
const [tab,setTab] = useState("excel");

const [form,setForm] = useState({
brand:"",
model:"",
reference_number:"",
movement:"",
year_of_production:"",
case_material:"",
case_diameter:"",
description:""
});

/* ================= EXCEL ================= */

async function upload(){

if(!file){
alert("Select file");
return;
}

const formData = new FormData();
formData.append("file",file);

const res = await fetch("/api/upload-watches",{
method:"POST",
body:formData
});

const data = await res.json();
alert(data.message);
}

/* ================= MANUAL ================= */

function handleChange(e){
setForm({...form,[e.target.name]:e.target.value});
}

async function manualSubmit(){

const formData = new FormData();

formData.append("brand",form.brand);
formData.append("model",form.model);
formData.append("reference_number",form.reference_number);
formData.append("movement",form.movement);
formData.append("year_of_production",form.year_of_production);
formData.append("case_material",form.case_material);
formData.append("case_diameter",form.case_diameter);
formData.append("description",form.description);

if(file){
formData.append("image",file);
}

const res = await fetch("/api/upload-watches",{
method:"POST",
body:formData
});

const data = await res.json();
alert(data.message);
}

/* ================= UI ================= */

return(

<div className="content">
<div className="form-container">

<div className="form-card">

<div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>

<button 
  onClick={()=>setTab("excel")} 
  className={`btn ${tab === "excel" ? "active-btn" : ""}`}
>
  Upload Excel
</button>

<button 
  onClick={()=>setTab("manual")} 
  className={`btn ${tab === "manual" ? "active-btn" : ""}`}
>
  Manual Entry
</button>

</div>

{tab==="excel" && (
<>

<h2 className="form-title">UPDATE STOCK</h2>

<input
className="form-input"
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button className="form-button" onClick={upload}>
UPDATE STOCK
</button>
</>
)}

{tab==="manual" && (
<>

<h2 className="form-title">Add Catalog</h2>

<input className="form-input" name="brand" placeholder="Brand" onChange={handleChange}/>
<input className="form-input" name="model" placeholder="Model" onChange={handleChange}/>
<input className="form-input" name="reference_number" placeholder="Reference" onChange={handleChange}/>
<input className="form-input" name="movement" placeholder="Movement" onChange={handleChange}/>
<input className="form-input" name="year_of_production" placeholder="Year" onChange={handleChange}/>
<input className="form-input" name="case_material" placeholder="Material" onChange={handleChange}/>
<input className="form-input" name="case_diameter" placeholder="Diameter" onChange={handleChange}/>
<input className="form-input" name="description" placeholder="Description" onChange={handleChange}/>

<input
className="form-input"
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button className="form-button" onClick={manualSubmit}>
Add Catalog
</button>
</>
)}

</div>

</div>

</div>
);
}
