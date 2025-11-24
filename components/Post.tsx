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

async function Post({
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
    <article className="py-4 sm:py-6 md:py-8 border-b border-gray-200 last:border-b-0">
      {/* Metadata */}
      <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
        {author ? (
          <>
            Publisher: <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{author}</span> On{" "}
            <time dateTime={date}>{formatedDate}</time>
          </>
        ) : (
          <>
            Published On: <time dateTime={date}>{formatedDate}</time>
          </>
        )}
      </div>

      {/* Image */}
      <div className="w-full aspect-video relative mt-2 sm:mt-3 mb-4 sm:mb-6 md:mb-8 rounded-lg overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1100px"
            className="object-cover object-center rounded-lg"
            priority={false}
          />
        ) : (
          <Image
            src="/thumbnail-placeholder.jpg"
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1100px"
            className="object-cover object-center rounded-lg"
            priority={false}
          />
        )}
      </div>

      {/* Category Badge */}
      {category && (
        <Link 
          href={`/categories/${encodeURIComponent(category)}`}
          className="inline-block py-1.5 sm:py-2 px-3 sm:px-4 bg-slate-800 rounded-xl sm:rounded-2xl text-white text-xs sm:text-sm md:text-base font-bold hover:bg-slate-700 transition-colors duration-200 mb-3 sm:mb-4"
        >
          {category}
        </Link>
      )}

      {/* Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold my-3 sm:my-4 break-words">{title}</h2>
      
      {/* Content */}
      <p className="content text-sm sm:text-base md:text-lg leading-relaxed break-words">{content}</p>

      {/* Links */}
      {link && link.length > 0 && (
        <div className="flex flex-col my-4 sm:my-6 gap-2 sm:gap-3">
          {link.map((lk, i) => (
            <div key={i} className="flex gap-2 sm:gap-3 items-start sm:items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
              <a 
                className="link text-sm sm:text-base break-all hover:underline" 
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
      
      {/* Edit/Delete Actions */}
      {isEditable && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 rounded-md bg-slate-100 w-full sm:w-fit font-bold mt-4 sm:mt-6">
          <Link 
            href={`/edit-post/${id}`}
            className="text-sm sm:text-base text-blue-700 hover:text-blue-900 hover:underline text-center sm:text-left min-h-[44px] flex items-center justify-center sm:justify-start"
          >
            Edit
          </Link>
          <DeletePostBtn id={id} />
        </div>
      )}
    </article>
  );
}

export default Post;
