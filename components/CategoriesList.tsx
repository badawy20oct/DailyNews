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

  return(<div className="flex flex-wrap justify-center gap-6 text-sm">
  {categories &&
    categories.map((category :TCategory) => (
      <Link
        className="px-4 py-2 bg-slate-800 rounded-2xl text-xl text-white font-bold hover:bg-white hover:text-slate-800 border-2 duration-500 

        "
        key={category.id}
        href={`/categories/${category.categoryName}`}
      >
        {" "}
        {category.categoryName}
      </Link>
    ))}
</div>)
}

export default CategoriesList;
