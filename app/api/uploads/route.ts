import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer Base64 pour Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload sur Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "transactions", // dossier Cloudinary
    });

    return NextResponse.json({
      success: true,
      path: uploadResponse.secure_url, // 🔥 URL publique à stocker dans ta DB
    });
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne lors de l'upload." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { success: false, message: "Chemin invalide." },
        { status: 400 }
      );
    }

    // Extraire le public_id depuis l'URL Cloudinary
    const parts = path.split("/");
    const publicIdWithExt = parts[parts.length - 1];
    const publicId = "transactions/" + publicIdWithExt.split(".")[0];

    // Supprimer sur Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      message: "Image supprimée avec succès de Cloudinary.",
    });
  } catch (error) {
    console.error("Erreur suppression Cloudinary:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne lors de la suppression." },
      { status: 500 }
    );
  }
}
