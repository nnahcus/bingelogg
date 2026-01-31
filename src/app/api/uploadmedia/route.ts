import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request ){
    try {
        const session = await auth()

        if(!session?.user?.id){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData()
        const file = formData.get('image') as File

        if(!file) {
            return NextResponse.json({ error: 'No file uploaded!!' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise ((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: "Covers",
                transformation: {
                    width: 300,
                    aspect_ratio: "2:3",
                    crop: "fill",
                    quality: "auto:best",
                    fetch_format: "auto",
                    dpr: "auto"
                }
            }, function (error, result){
          if ( error ) {
            reject(error);
            return;
          }
          resolve(result);
        }).end(buffer);
      })
        revalidatePath('/dashboard');

      return NextResponse.json({
        url: (result as any).secure_url,
        success: true
      })
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { 
                error: 'Upload failed',
                message: (error as Error).message 
            }, 
            { status: 500 }
        );
    }
}