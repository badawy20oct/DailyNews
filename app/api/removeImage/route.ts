import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const removeImage = async (publicId: string) => {
    try {
        const res = await cloudinary.uploader.destroy(publicId);
        console.log("Image removed:", res);
        return res;
    } catch (error) {
        console.error("Error removing image:", error);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        const { publicID, publicId } = await req.json();
        const id = publicID || publicId;
        
        if (!id) {
            return NextResponse.json({ error: "publicID is required" }, { status: 400 });
        }
        
        await removeImage(id);
        return NextResponse.json({ message: "Success" });
    } catch (error) {
        console.error("Error removing image:", error);
        return NextResponse.json({ error: "Failed to remove image" }, { status: 500 });
    }
}