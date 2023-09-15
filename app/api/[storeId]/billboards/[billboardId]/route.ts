//Todo patch route to update the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

//Todo Get funciton for billbard
export async function GET(
    req: Request,
    {params}:{params:{billboardId:string}}
){
    try {
        if(!params.billboardId){
            return new NextResponse("Billboard id is required",{status:400})
        }

        const billboard = await prismadb.store.findUnique({
            where:{
                id:params.billboardId,
                
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}

//Todo patch funciton for billboard
export async function PATCH(
    req: Request,
    {params}:{params:{storeId:string,billboardId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {label,imageUrl} = body;
        if(!userId){
         return new NextResponse("Unauthenticated", {status:401});
        }
        if(!label){
            return new NextResponse("Label is required",{status:400})
        }
        if(!imageUrl){
            return new NextResponse("ImageUrl is required",{status:400})
        }
        if(!params.billboardId){
            return new NextResponse("BillboardId id is required",{status:400})
        }
        const storeByUser = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUser){
            return new NextResponse("Unauthorized",{status:403})
        }
        const billboard = await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId,
                
            },
            data:{
                label,imageUrl
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_PATCH]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}





//Todo! Delete route to delete the store
export async function DELETE(
    req: Request,
    {params}:{params:{storeId:string,billboardId:string}}
){
    try {
        const {userId} = auth();
                if(!userId){
         return new NextResponse("Unauthenticated", {status:401});
        }
        
        if(!params.billboardId){
            return new NextResponse("Billboard id is required",{status:400})
        }
        const storeByUser = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUser){
            return new NextResponse("Unauthorized",{status:403})
        }

        const billboard = await prismadb.store.deleteMany({
            where:{
                id:params.billboardId,
                
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_DELETE]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}