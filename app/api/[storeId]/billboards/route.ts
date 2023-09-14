import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {label, imageUrl} =body;
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!label){
            return new NextResponse("Label is required",{status:400})
        }
        if(!imageUrl){
            return new NextResponse("Image is required is required",{status:400})
        }
        if(!params.storeId){
            return new NextResponse("Store id is not found",{status:400})
        }
        const storeByUser = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        const billboard = await prismadb.billboard.create({
            data:{
                label,imageUrl,storeId:params.storeId
            }
        });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_POST]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}