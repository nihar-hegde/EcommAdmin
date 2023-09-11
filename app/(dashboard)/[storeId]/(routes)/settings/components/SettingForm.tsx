"use client";
import React, { FC, useState } from "react";

import { Store } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
interface SettingFormProps {
  initialData: Store;
}

const formSchema = z.object({
    name:z.string().min(1),
})
type SettingFormValues = z.infer<typeof formSchema>;


const SettingForm: FC<SettingFormProps> = ({ initialData }) => {
    const [open ,setOpen] = useState(false);
    const [loading ,setLoading] = useState(false);
    const form = useForm<SettingFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    });
    const onSubmit = async (data:SettingFormValues)=>{
        console.log("submit", data);
    }
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Setting" description="manage store preference" />
        <Button disabled={loading} variant={"destructive"} size={"icon"} onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8 w-full"
        >
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                control={form.control}
                name="name"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Store Name" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
            </div>
            <Button
            disabled={loading} className="al-auto" type="submit"
            >Save Changes</Button>
        </form>
      </Form>
    </>
  );
};

export default SettingForm;