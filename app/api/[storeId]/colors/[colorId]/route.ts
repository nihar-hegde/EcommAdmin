//Todo patch route to update the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

//Todo Get funciton for billbard
export async function GET(
    req: Request,
    {params}:{params:{colorId:string}}
){
    try {
        if(!params.colorId){
            return new NextResponse("Color id is required",{status:400})
        }

        const color = await prismadb.color.findUnique({
            where:{
                id:params.colorId,
                
            }
        });
        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_GET]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}

//Todo patch funciton for billboard
export async function PATCH(
    req: Request,
    {params}:{params:{storeId:string,colorId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name,value} = body;
        if(!userId){
         return new NextResponse("Unauthenticated", {status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400})
        }
        if(!value){
            return new NextResponse("Value is required",{status:400})
        }
        if(!params.colorId){
            return new NextResponse("Color id is required",{status:400})
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
        const color = await prismadb.color.updateMany({
            where:{
                id:params.colorId,
                
            },
            data:{
                name,value
            }
        });
        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_PATCH]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}





//Todo! Delete route to delete the store
// export async function DELETE(
//     req: Request,
//     {params}:{params:{storeId:string,billboardId:string}}
// ){
//     try {
//         const {userId} = auth();
//                 if(!userId){
//          return new NextResponse("Unauthenticated", {status:401});
//         }
        
//         if(!params.billboardId){
//             return new NextResponse("Billboard id is required",{status:400})
//         }
//         const storeByUser = await prismadb.store.findFirst({
//             where:{
//                 id:params.storeId,
//                 userId
//             }
//         })
//         if(!storeByUser){
//             return new NextResponse("Unauthorized",{status:403})
//         }

//         const billboard = await prismadb.store.deleteMany({
//             where:{
//                 id:params.billboardId,
                
//             }
//         });
//         return NextResponse.json(billboard);

//     } catch (error) {
//         console.log('[BILLBOARD_DELETE]',error);
//         return new NextResponse('Internal Error',{status:500})
//     }
// }

export async function DELETE(
    req: Request,
    { params }: { params: { colorId: string, storeId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.colorId) {
        return new NextResponse("Color id is required", { status: 400 });
      }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId,
        }
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }
  
      const color = await prismadb.color.delete({
        where: {
          id: params.colorId,
        }
      });
    
      return NextResponse.json(color);
    } catch (error) {
      console.log('[COLOR_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };