"use client";
import AllocateWatch from "@/components/AllocateWatch";
import ClientsDetails from "@/components/ClientDetails";
import SellersRequirements from "@/components/SellersRequirements";
import Alluser from "@/components/Alluser";
export default function DashboardPage(){


return(
<div className="content">
<SellersRequirements />
<AllocateWatch />
<ClientsDetails />
<Alluser />
</div>
);
}