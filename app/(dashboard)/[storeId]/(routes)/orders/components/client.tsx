"use client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { FC } from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-tabel";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage Orders for your store"
      />

      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};
