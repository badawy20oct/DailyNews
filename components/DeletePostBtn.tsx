'use client'

import React from 'react'
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';


function DeletePostBtn({ id }: { id: string }) {

  const router = useRouter();

  const deleteImage = async (publicId: string) => {
    const res = await fetch("/api/removeImage", {
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
    <button onClick={() => handleDelete()} className='text-red-600 cursor-pointer'>
      Delete
    </button>
  )
}

export default DeletePostBtn
