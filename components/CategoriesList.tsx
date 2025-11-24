import React from "react";
import Link from "next/link";
import { TCategory } from "@/app/types";


const getCategories = async (): Promise<TCategory[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
      cache: "no-store"
    });

    if(res.ok){
      const categories = await res.json();
      return categories;
    }
  } catch (error) {
    console.log(error);
  }
  return null ;
}
async function CategoriesList() {
  const categories = await getCategories();

  return(
    <div className="w-full mb-6 sm:mb-8 md:mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {categories &&
          categories.map((category: TCategory) => (
            <Link
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-slate-800 rounded-xl sm:rounded-2xl text-white font-bold hover:bg-white hover:text-slate-800 border-2 border-transparent hover:border-slate-800 duration-300 transition-all text-center text-xs sm:text-sm md:text-base lg:text-lg min-h-[44px] flex items-center justify-center"
              key={category.id}
              href={`/categories/${category.categoryName}`}
            >
              {category.categoryName}
            </Link>
          ))}
      </div>
    </div>
  )
}

export default CategoriesList;
