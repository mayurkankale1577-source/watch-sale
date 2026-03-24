"use client";

import { useEffect, useState } from "react";
 

// 🔹 Filter Section (Accordion)
function FilterSection({title, items, type, handleFilterChange}) {

  const [open,setOpen] = useState(false);

  return (
    <div className="filter-section">
      
      <div className="filter-title" onClick={()=>setOpen(!open)}>
        {title} <span>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="filter-items">
          {items.map((item,i)=>(
            <label key={i} className="filter-item">
              <input
                type="checkbox"
                onChange={()=>handleFilterChange(type,item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      )}

    </div>
  );
}

export default function BrandDetails(){

const [data,setData] = useState([]);
const [search,setSearch] = useState("");
const [currentPage,setCurrentPage] = useState(1);
const [showFilters,setShowFilters] = useState(false);

const [filters,setFilters] = useState({
  brand: [],
  model: [],
  material: [],
  diameter: []
});

const itemsPerPage = 12;

// 🔹 FETCH
useEffect(()=>{
  fetch("/api/brand-details")
  .then(res=>res.json())
  .then(data=>setData(data));
},[]);

// 🔹 DOWNLOAD
function downloadCSV(){
  window.location.href="/api/download-brand-details";
}

// 🔹 UNIQUE VALUES
const brands = [...new Set(data.map(item=>item.brand))];
const models = [...new Set(data.map(item=>item.model))];
const materials = [...new Set(data.map(item=>item.case_material))];
const diameters = [...new Set(data.map(item=>item.case_diameter))];

// 🔹 FILTER CHANGE
function handleFilterChange(type,value){
  setFilters(prev=>{
    const exists = prev[type].includes(value);

    return {
      ...prev,
      [type]: exists
        ? prev[type].filter(v=>v!==value)
        : [...prev[type],value]
    }
  });

  setCurrentPage(1);
}

// 🔹 FILTER LOGIC
const filteredData = data.filter(item=>{

  const matchBrand =
  filters.brand.length===0 || filters.brand.includes(item.brand);

  const matchModel =
  filters.model.length===0 || filters.model.includes(item.model);

  const matchMaterial =
  filters.material.length===0 || filters.material.includes(item.case_material);

  const matchDiameter =
  filters.diameter.length===0 || filters.diameter.includes(item.case_diameter);

  const matchSearch =
  item.reference_number.toLowerCase().includes(search.toLowerCase()) ||
  item.model.toLowerCase().includes(search.toLowerCase());

  return matchBrand && matchModel && matchMaterial && matchDiameter && matchSearch;

});

// 🔹 PAGINATION
const totalPages = Math.ceil(filteredData.length/itemsPerPage);
const start = (currentPage-1)*itemsPerPage;
const paginatedData = filteredData.slice(start,start+itemsPerPage);

return(

<div className="content">

{/* 🔹 TOPBAR */}
<div className="topbar">
  <h2>Catalog Details</h2>

  <button onClick={downloadCSV} className="download-btn">
    Download Catalog Details
  </button>
</div>

{/* 🔹 CONTROLS */}
<div className="top-controls">

{/* FILTER BUTTON */}
<button className="filter-btn" onClick={()=>setShowFilters(true)}>
  All ▼
</button>

{/* SEARCH */}
<input
  type="text"
  placeholder="Search by model or reference..."
  value={search}
  onChange={(e)=>{
    setSearch(e.target.value);
    setCurrentPage(1);
  }}
  className="search"
/>

</div>

{/* 🔹 FILTER POPUP */}
{showFilters && (
<div className="overlay" onClick={()=>setShowFilters(false)}>

<div className="sidebar-popup" onClick={(e)=>e.stopPropagation()}>

<button className="close-btn" onClick={()=>setShowFilters(false)}>✖</button>

<h3>Filters</h3>

<FilterSection title="Brand" items={brands} type="brand" handleFilterChange={handleFilterChange}/>
<FilterSection title="Model" items={models} type="model" handleFilterChange={handleFilterChange}/>
<FilterSection title="Material" items={materials} type="material" handleFilterChange={handleFilterChange}/>
<FilterSection title="Case Size" items={diameters} type="diameter" handleFilterChange={handleFilterChange}/>

</div>

</div>
)}

{/* 🔹 GRID */}
<div className="grid">

{paginatedData.map((item,index)=>(

<div key={index} className="card">

{item.image && (
<img src={item.image} className="watch-img"/>
)}

<h3>{item.brand}</h3>

<p><b>Model:</b> {item.model}</p>
<p><b>Reference:</b> {item.reference_number}</p>
<p><b>Material:</b> {item.case_material}</p>
<p><b>Size:</b> {item.case_diameter}</p>

</div>

))}

</div>

{/* 🔹 PAGINATION */}
<div className="pagination">

<button disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)}>
Prev
</button>

{Array.from({length:totalPages},(_,i)=>(
<button
key={i}
className={currentPage===i+1?"active":""}
onClick={()=>setCurrentPage(i+1)}
>
{i+1}
</button>
))}

<button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(currentPage+1)}>
Next
</button>

</div>

</div>

)
}