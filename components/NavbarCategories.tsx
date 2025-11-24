"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TCategory } from "@/app/types";

const NavbarCategories = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (isMobile) {
    // Mobile: Vertical list
    return (
      <div className="flex flex-col gap-3 mt-6">
        {categories && categories.length > 0 ? (
          categories.map((category: TCategory) => (
            <Link
              key={category.id}
              href={`/categories/${category.categoryName}`}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-blue-950 font-semibold transition-colors min-h-[44px] flex items-center"
            >
              {category.categoryName}
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">No categories available</p>
        )}
      </div>
    );
  }

  // Desktop: Horizontal row
  return (
    <div className="flex flex-row gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide">
      {categories && categories.length > 0 ? (
        categories.map((category: TCategory) => (
          <Link
            key={category.id}
            href={`/categories/${category.categoryName}`}
            className="px-4 py-2 bg-slate-800 rounded-xl text-white font-bold hover:bg-white hover:text-slate-800 border-2 border-transparent hover:border-slate-800 duration-300 transition-all text-sm md:text-base lg:text-lg whitespace-nowrap min-h-[44px] flex items-center justify-center"
          >
            {category.categoryName}
          </Link>
        ))
      ) : (
        <p className="text-sm text-gray-500">No categories available</p>
      )}
    </div>
  );
};

export default NavbarCategories;

