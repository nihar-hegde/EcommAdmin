import prismadb from '@/lib/prismadb'
import React, { FC } from 'react'


interface DashboardLayoutProps{
  params:{storeId:string}
}

const DashBoardPage: FC<DashboardLayoutProps> = async ({
  params
}) => {
  const store = await prismadb.store.findFirst({
    where:{
      id:params.storeId
    }
  });
  return (
    <div>Active Store: {store?.name}</div>
  )
}

export default DashBoardPage