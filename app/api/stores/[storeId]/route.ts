//Todo patch route to update the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name} = body;
        if(!userId){
         return new NextResponse("Unauthenticated", {status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400})
        }
        if(!params.storeId){
            return new NextResponse("Store id is required",{status:400})
        }
        const store = await prismadb.store.updateMany({
            where:{
                id:params.storeId,
                userId
            },
            data:{
                name
            }
        });
        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_PATCH]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}





//Todo! Delete route to delete the store