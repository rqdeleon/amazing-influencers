"use client"

import { OrderSchema } from "@/app/api/orders/get/route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getAllOrders } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import { ExternalLinkIcon, Trash2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";
import useSwr from 'swr';
import { deleteOrder } from "../../../../lib/data";

export default function Page() {
  const { user } = useUser();
  const { data, mutate } = useSwr<OrderSchema[], any, any>(user?.primaryEmailAddress?.emailAddress, getAllOrders);

  return (
    <div className="max-w-full flex flex-col w-full space-y-4">
      <header className="flex flex-row justify-between">
        <h1 className="font-bold text-2xl">Orders</h1>
      </header>
      <section className="shadow-md bg-white rounded-xl flex flex-col items-stretch">
        <header className="p-6 bg-[rgba(243,244,246,0.8)] justify-start">
          <h2 className="font-bold text-base">Order search</h2>
        </header>
        <div className="p-6 flex flex-col items-stretch space-y-4">
          <p>Any order ID uploaded here will be verified against the customer-submitted order ID in the survey links.</p>
          {/* <Input placeholder="Search here..." /> */}
        </div>
      </section>
      <section className="shadow-md rounded-xl w-full overflow-hidden grid">
        <Table className="w-full table-auto text-nowrap">
          <TableHeader className="bg-[#F3F4F6]">
              <TableRow className="text-[#343A40] font-bold">
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell />
              </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {!data?.length && (
              <TableRow>
                <TableCell colSpan={11} className="py-4">
                  None found
                </TableCell>
              </TableRow>
            )}
            {data && data.length && data?.map((order: OrderSchema, index) => (
              <TableRow key={index} className="font-medium">
                <TableCell>{order.orderNum}</TableCell>
                <TableCell>{order.date.toString()}</TableCell>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>
                  <Button 
                    variant={"ghost"}
                    onClick={() => deleteOrder(order.id).then(() => mutate())}
                  >
                    <TrashIcon className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}