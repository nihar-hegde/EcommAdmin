'use client'
import React, { FC, useEffect, useState } from 'react'

interface ImageUploadProps{
    disabled?:boolean;
    onChange:(value:string) => void;
    onRemove:(value:string) => void;
    value:string[];
}


const ImageUpload:FC<ImageUploadProps> = ({disabled,onChange,onRemove,value}) => {
    const [isMounted,setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])
    if(!isMounted){
     
        return null;
    }

    return (
    <div>ImageUpload</div>
  )
}

export default ImageUpload