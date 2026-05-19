import db from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(){

try{


/* MONTHLY SALES */

const [monthlySales] = await db.query(`

SELECT
MONTH(sale_date) as month,
COUNT(*) as total_sales

FROM sales

GROUP BY MONTH(sale_date)

ORDER BY month ASC

`);



/* REVENUE */

const [revenueData] = await db.query(`

    SELECT
    MONTH(s.sale_date) as month,
    
    SUM(
    COALESCE(w.price,0) *
    COALESCE(s.quantity,1)
    ) as revenue
    
    FROM sales s
    
    LEFT JOIN watches w
    ON s.watch_id = w.id
    
    GROUP BY MONTH(s.sale_date)
    
    ORDER BY month ASC
    
    `);



/* REQUIREMENT STATUS */

const [statusData] = await db.query(`

SELECT
status,
COUNT(*) as total

FROM requirements

GROUP BY status

`);


return NextResponse.json({

monthlySales,
revenueData,
statusData

});

}catch(err){

console.log(err);

return NextResponse.json({

monthlySales:[],
revenueData:[],
statusData:[]

});

}

}