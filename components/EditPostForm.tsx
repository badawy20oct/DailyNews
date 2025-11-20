"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TCategory, TPost } from "@/app/types";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";


function EditPostForm({ post }: { post: TPost }) {
  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [inputLink, setInputLink] = useState("");
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [publicID, setPublicID] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const categoryName = await res.json();
        setCategories(categoryName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();

    const initiateValues = () => {
      setTitle(post.title);
      setContent(post.content);
      setSelectedCategory(post.categoryName || "");
      setImageURL(post.imageURL || "");
      setPublicID(post.publicID || "");
      setLinks(post.links || []);
    };
    initiateValues();
  }, [post, post.categoryName]);

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const info = result.info;
      if (info?.secure_url && info?.public_id) {
        setImageURL(info.secure_url);
        setPublicID(info.public_id);
      }
    }
  };

  const removeImage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/removeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicID })
      });

      if (res.ok) {
        setPublicID("");
        setImageURL("");
      }
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const addLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (inputLink.trim()) {
      setLinks((prev) => [...prev, inputLink]);
      setInputLink("");
    }
  };

  const deleteLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Title and Content are Required");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          links,
          categoryName: selectedCategory,
          imageURL,
          publicID,
          authorEmail: post.authorEmail,
        }),
      });

      if (res.ok) {
        toast.success("Post Edited Successfully")
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Somthing went Rong")
      console.error(error);
    }
  };



  return (
    <div>
      <h1 className="font-bold flex justify-center text-4xl text-blue-950 mb-6">
        Update Post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          value={title}
        />
        <textarea
          onChange={(e) => setContent(e.target.value)}
          className="h-40"
          placeholder="Content"
          value={content}
        ></textarea>

        {links.map((link, i) => (
          <div className="flex gap-2" key={i}>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </span>
            <Link className="text-blue-700" href={link}>
              {link}
            </Link>
            <span
              className="text-red-600 cursor-pointer"
              onClick={() => deleteLink(i)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
                />
              </svg>
            </span>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            className="flex-1"
            type="text"
            placeholder="Add Links"
            onChange={(e) => setInputLink(e.target.value)}
            value={inputLink}
          />
          <button
            onClick={addLink}
            className="btn flex gap-2 items-center cursor-pointer"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
            Add
          </button>
        </div>


        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "b2images"}
          onSuccess={handleImageUpload}
          className={`relative h-96 border-2 mt-4 border-dotted grid place-items-center bg-slate-100 rounded-md cursor-pointer hover:bg-slate-200 transition-colors ${imageURL && 'pointer-events-none opacity-50'}`}
        >
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 mx-auto mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-sm text-gray-600">{imageURL ? "Image uploaded" : "Click to upload image"}</p>
          </div>
          {imageURL && (
            <>
              {console.log("Rendering image with URL:", imageURL)}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={imageURL}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                  alt={title || "Uploaded preview"}
                  unoptimized
                />
              </div>
            </>
          )}
        </CldUploadButton>

        {publicID && (
          <button
            onClick={removeImage}
            type="button"
            className="w-fit py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
          >
            Remove Image
          </button>
        )}


        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full  py-3 px-4 rounded-xl bg-white text-blue-950 
          border border-blue-900/40 shadow-sm
          focus:border-blue-900 focus:ring-2 focus:ring-blue-900/30 
          transition-all duration-200 outline-none cursor-pointer"          value={selectedCategory}
        >
          <option value="" >Select A Category</option>
          {categories && categories.map((category) => (
            <option key={category.id} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>

        <button className="font-bold text-2xl text-white bg-blue-950 py-2 rounded-2xl cursor-pointer">
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPostForm;
