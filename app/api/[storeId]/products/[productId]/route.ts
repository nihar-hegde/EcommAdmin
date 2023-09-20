//Todo patch route to update the store

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

//Todo Get funciton for billbard
export async function GET(
    req: Request,
    {params}:{params:{productId:string}}
){
    try {
        if(!params.productId){
            return new NextResponse("Product id is required",{status:400})
        }

        const product = await prismadb.product.findUnique({
            where:{
                id:params.productId,                
            },
            include:{
              images:true,
              category:true,
              size:true,
              color:true,
            }
        });
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}

//Todo patch funciton for billboard
export async function PATCH(
    req: Request,
    {params}:{params:{storeId:string,productId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {
          name,
          price,
          categoryId,
          colorId,
          sizeId,
          images,
          isFeatured,
          isArchived,
      } =body;
        if(!userId){
         return new NextResponse("Unauthenticated", {status:401});
        }
        
        if(!name){
          return new NextResponse("Name is required",{status:400})
      }
      if(!images || !images.length){
          return new NextResponse("Images are required",{status:400})
      }
      if(!price){
          return new NextResponse("Price is required is required",{status:400})
      }
      if(!categoryId){
          return new NextResponse("Category Id is required is required",{status:400})
      }
      if(!colorId){
          return new NextResponse("color id is required is required",{status:400})
      }

        if(!params.productId){
            return new NextResponse("Product id is required",{status:400})
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
         await prismadb.product.update({
            where:{
                id:params.productId,
                
            },
            data:{
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images:{
                  deleteMany:{}
                },
                isFeatured,
                isArchived,
            }
        });

        const product = await prismadb.product.update({
          where:{
            id:params.productId
          },
          data:{
            images:{
              createMany:{
                data:[
                  ...images.map((image:{url:string})=>image)
                ]
              }
            }
          }
        }) 


        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_PATCH]',error);
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
    { params }: { params: { productId: string, storeId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.productId) {
        return new NextResponse("ProductId id is required", { status: 400 });
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
  
      const product = await prismadb.product.delete({
        where: {
          id: params.productId,
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };