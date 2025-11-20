import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import DeletePostBtn from "./DeletePostBtn";

interface NewsProps {
  id: string;
  author: string;
  authorEmail: string;
  date: string;
  title: string;
  content: string;
  link?: string[];
  category?: string;
  thumbnail?: string;
}

async function News({
  id,
  author,
  authorEmail,
  date,
  title,
  content,
  link,
  category,
  thumbnail,
}: NewsProps) {
  const session = await getServerSession(authOptions);

  const isEditable = session && session?.user?.email === authorEmail;

  const dateObject = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formatedDate = dateObject.toLocaleDateString("en-US", options);

  return (
    <div className="py-8">
      <div>
        {author ? (
          <>
            Publisher: <span className="text-xl font-bold">{author}</span> On{" "}
            {formatedDate}
          </>
        ) : (
          <>
            Published On:
            {` ${formatedDate}`}
          </>
        )}
      </div>

      <div className="w-full h-150 relative mt-3 mb-[30px]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover object-center rounded-md"
          />
        ) : (
          <Image
            src="/thumbnail-placeholder.jpg"
            alt={title}
            fill
            className="object-cover object-center rounded-md"
          />
        )}
      </div>

      {category && (
        <Link 
          href={`/categories/${encodeURIComponent(category)}`}
          className="inline-block py-2 px-4 bg-slate-800 rounded-2xl text-white font-bold hover:bg-slate-700 transition-colors duration-200 mb-3"
        >
          {category}
        </Link>
      )}

      <h2>{title}</h2>
      <p className="content">{content}</p>

      {link && (
        <div className="flex flex-col my-4 gap-3">
          {link.map((lk, i) => (
            <div key={i} className="flex gap-2 items-center">
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
              <a 
                className="link" 
                href={lk} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {lk}
              </a>
            </div>
          ))}
        </div>
      )}
      {isEditable && (
        <div className="flex gap-3 py-2 px-4 rounded-md bg-slate-100 w-fit font-bold">
          <Link href={`/edit-post/${id}`}>Edit</Link>
          <DeletePostBtn id={id} />
        </div>
      )}
    </div>
  );
}

export default News;
