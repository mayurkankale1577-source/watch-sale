"use client";

import { useEffect, useState } from "react";

import {

BarChart,
Bar,
LineChart,
Line,
PieChart,
Pie,
Cell,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer

} from "recharts";

export default function DashboardCharts(){

const [data,setData] = useState(null);

useEffect(()=>{

fetch("/api/dashboard-analytics")
.then(res=>res.json())
.then(result=>{

console.log(result);

const months = [
"",
"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"
];


// SAFE DATA

const monthlySales = result.monthlySales || [];
const revenueData = result.revenueData || [];
const statusData = result.statusData || [];


// SALES CHART

const salesChart = monthlySales.map(item => ({

month: months[item.month],
sales: item.total_sales

}));


// REVENUE CHART

const revenueChart = revenueData.map(item => ({

month: months[item.month],
revenue: item.revenue

}));


// STATUS CHART

const statusChart = statusData.map(item => ({

name: item.status,
value: item.total

}));


setData({

salesChart,
revenueChart,
statusChart

});

})
.catch(err=>{

console.log(err);

});

},[]);


if(!data) return null;

const COLORS = [
"#2563eb",
"#16a34a",
"#dc2626",
"#f59e0b"
];

return(

<div className="charts-grid">


{/* MONTHLY SALES */}

<div className="chart-card">

<h3>Monthly Sales</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={data.salesChart}>

<XAxis dataKey="month" />

<YAxis />

<Tooltip />

<Bar
dataKey="sales"
fill="#2563eb"
/>

</BarChart>

</ResponsiveContainer>

</div>



{/* REVENUE */}

<div className="chart-card">

<h3>Revenue Analytics</h3>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={data.revenueChart}>

<XAxis dataKey="month" />

<YAxis />

<Tooltip />

<Line
type="monotone"
dataKey="revenue"
stroke="#16a34a"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>



{/* REQUIREMENT STATUS */}

<div className="chart-card full-chart">

<h3>Requirement Status</h3>

<ResponsiveContainer width="100%" height={350}>

<PieChart>

<Pie
data={data.statusChart}
dataKey="value"
nameKey="name"
outerRadius={120}
label
>

{data.statusChart.map((entry,index)=>(

<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>

))}

</Pie>

<Tooltip />

</PieChart>

</ResponsiveContainer>

</div>

</div>

);

}