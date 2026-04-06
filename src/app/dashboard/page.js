"use client";
import AllocateWatch from "@/components/AllocateWatch";
import ClientsDetails from "@/components/ClientDetails";
import SellersRequirements from "@/components/SellersRequirements";
import Alluser from "@/components/Alluser";
import IncomingTransferRequests from "@/components/IncomingTransferRequests";
import TransferRequests from "@/components/TransferRequests";
import TransferHistory from "@/components/TransferHistory";
export default function DashboardPage(){


return(
<div className="content">
<SellersRequirements />
<AllocateWatch />
<ClientsDetails />
<Alluser />

<TransferRequests />
<IncomingTransferRequests />  
{/* <TransferHistory />   */}
</div>
);
}