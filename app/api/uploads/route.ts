import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises"; // ✅ utiliser fs/promises
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import crypto from "crypto"; // ✅ importer crypto

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "Aucun fichier reçu",
      });
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dossier de destination
    const uploadDir = join(process.cwd(), "public", "uploads");

    // ✅ Crée le dossier si inexistant
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Générer un nom unique
    const ext = file.name.split(".").pop();
    const uniqueName = crypto.randomUUID() + "." + ext;

    const filePath = join(uploadDir, uniqueName);
    const publicPath = `/uploads/${uniqueName}`;

    // ✅ Écrire le fichier sur le disque
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { success: false, message: "Chemin Invalide." },
        { status: 400 }
      );
    }
    const filePath = join(process.cwd(), "public", path);
    if (!existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          message: "Fichier non trouvé.",
        },
        { status: 404 }
      );
    }
    await unlink(filePath);
    return NextResponse.json(
      {
        success: true,
        message: "Fichier supprimer avec succes.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
  }
}
