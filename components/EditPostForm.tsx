"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TCategory, TPost } from "@/app/types";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
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

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === "success" || result.info) {
      const info = result.info;
      if (info && typeof info === 'object' && 'secure_url' in info && 'public_id' in info) {
        setImageURL(info.secure_url as string);
        setPublicID(info.public_id as string);
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
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="font-bold text-center text-2xl sm:text-3xl md:text-4xl text-blue-950 mb-4 sm:mb-6">
        Update Post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 md:gap-6">
        <div>
          <label htmlFor="edit-title" className="block text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-950 mb-2">
            Title
          </label>
          <input
            id="edit-title"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter post title"
            value={title}
            className="w-full text-sm sm:text-base md:text-lg min-h-[44px]"
            required
          />
        </div>
        <div>
          <label htmlFor="edit-content" className="block text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-950 mb-2">
            Content
          </label>
          <textarea
            id="edit-content"
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 sm:h-40 md:h-48 text-sm sm:text-base resize-y"
            placeholder="Write your post content here..."
            value={content}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-950 mb-2">
            Links
          </label>
          {links.length > 0 ? (
            <div className="flex flex-col gap-2 sm:gap-3">
              {links.map((link, i) => (
                <div className="flex gap-2 sm:gap-3 items-center p-2 sm:p-3 bg-gray-50 rounded-md" key={i}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-blue-700"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                  <Link className="text-blue-700 text-sm sm:text-base break-all hover:underline flex-1" href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteLink(i)}
                    className="text-red-600 hover:text-red-800 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Remove link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No links added yet</p>
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              className="flex-1 min-h-[44px] text-sm sm:text-base"
              type="text"
              placeholder="https://example.com"
              onChange={(e) => setInputLink(e.target.value)}
              value={inputLink}
            />
            <button
              type="button"
              onClick={addLink}
              className="btn flex gap-2 items-center justify-center cursor-pointer min-h-[44px] px-4 sm:px-6 text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-950 mb-2">
            Cover Image
          </label>
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "b2images"}
            onSuccess={handleImageUpload}
            className={`relative w-full h-48 sm:h-64 md:h-80 lg:h-96 border-2 border-dotted grid place-items-center bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors ${imageURL && 'pointer-events-none opacity-50'}`}
          >
            <div className="text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">{imageURL ? "Image uploaded" : "Click to upload image"}</p>
            </div>
            {imageURL && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={imageURL}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  alt={title || "Uploaded preview"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1100px"
                  unoptimized
                />
              </div>
            )}
          </CldUploadButton>
          {publicID && (
            <button
              onClick={removeImage}
              type="button"
              className="mt-3 w-full sm:w-fit py-2 sm:py-2.5 px-4 sm:px-6 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold transition-colors min-h-[44px] text-sm sm:text-base"
            >
              Remove Image
            </button>
          )}
        </div>

        <div>
          <label htmlFor="edit-category" className="block text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-950 mb-2">
            Category
          </label>
          <select
            id="edit-category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-white text-blue-950 text-sm sm:text-base md:text-lg min-h-[44px]
            border border-blue-900/40 shadow-sm
            focus:border-blue-900 focus:ring-2 focus:ring-blue-900/30 
            transition-all duration-200 outline-none cursor-pointer"
            value={selectedCategory}
            required
          >
            <option value="">Select A Category</option>
            {categories && categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          className="w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white bg-blue-950 py-3 sm:py-3.5 md:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-blue-900 transition-colors min-h-[44px]"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPostForm;
