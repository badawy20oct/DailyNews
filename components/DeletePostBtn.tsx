'use client'

import React from 'react'
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';


function DeletePostBtn({ id }: { id: string }) {

  const router = useRouter();

  const deleteImage = async (publicId: string) => {
    await fetch("/api/removeImage", {
      method: "POST",
      headers: { "Content-Type": "application.json" },
      body: JSON.stringify({ publicId }),
    }
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure Deleting Post ");

    if (confirmed) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
          headers: {
            "content-type": "application/json"
          },
        });


        if (res.ok) {
          console.log("Post Deleted")
          const post = await res.json();
          const { publicID } = post;
          await deleteImage(publicID)
          router.refresh();
          toast.success("Post Deleted Successfully")
        }
      }
      catch (error) {
        toast.error("Somthing went Rong")
        console.log(error)
      }
    }
  }


  return (
    <button 
      onClick={() => handleDelete()} 
      className='text-sm sm:text-base text-red-600 hover:text-red-800 cursor-pointer min-h-[44px] flex items-center justify-center sm:justify-start hover:underline'
    >
      Delete
    </button>
  )
}

export default DeletePostBtn
