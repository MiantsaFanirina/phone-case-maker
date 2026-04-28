'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Helper to save base64 data URL as file
export async function saveBase64Image(dataUrl: string | null | undefined): Promise<string | null> {
  if (!dataUrl) return null;
  
  // If already a file path, return as-is
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  try {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const hash = crypto.randomBytes(16).toString('hex');
    const ext = mimeType.includes('png') ? '.png' : mimeType.includes('jpeg') || mimeType.includes('jpg') ? '.jpg' : '.png';
    const filename = `image-${hash}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Failed to save image file:', error);
    return null;
  }
}

export async function createDesign(data: {
  name: string;
  caseColor?: string;
  caseFinish?: string;
  imageUrl?: string;
  editorImageUrl?: string;
  positionX?: number;
  positionY?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
}) {
  const imageUrl = await saveBase64Image(data.imageUrl);
  const editorImageUrl = await saveBase64Image(data.editorImageUrl);

  const design = await prisma.design.create({
    data: {
      name: data.name,
      caseColor: data.caseColor || '#DFCEEA',
      caseFinish: data.caseFinish || 'glossy',
      imageUrl: imageUrl,
      editorImageUrl: editorImageUrl,
      positionX: data.positionX || 0,
      positionY: data.positionY || 0,
      scale: data.scale || 0.7,
      rotation: data.rotation || 0,
      opacity: data.opacity || 1,
    },
  });
  revalidatePath('/designs');
  return design;
}

export async function getDesign(id: string) {
  const design = await prisma.design.findUnique({
    where: { id },
  });
  
  // For single design view, return full data (images loaded separately if needed)
  return design;
}

export async function getDesigns() {
  const designs = await prisma.design.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      caseColor: true,
      caseFinish: true,
      createdAt: true,
      updatedAt: true,
      // Only return a flag indicating if images exist, not the full data
      imageUrl: true,
      editorImageUrl: true,
    },
  });
  
  // Return lightweight version - just indicate if image exists
  return designs.map(d => ({
    ...d,
    hasImage: !!(d.imageUrl || d.editorImageUrl),
    imageUrl: d.imageUrl && !d.imageUrl.startsWith('data:') ? d.imageUrl : null,
    editorImageUrl: d.editorImageUrl && !d.editorImageUrl.startsWith('data:') ? d.editorImageUrl : null,
  }));
}

export async function updateDesign(
  id: string,
  data: {
    name?: string;
    caseColor?: string;
    caseFinish?: string;
    imageUrl?: string | null;
    editorImageUrl?: string | null;
    positionX?: number;
    positionY?: number;
    scale?: number;
    rotation?: number;
    opacity?: number;
  }
) {
  const updateData: any = { ...data };
  
  if (data.imageUrl) {
    updateData.imageUrl = await saveBase64Image(data.imageUrl);
  }
  if (data.editorImageUrl) {
    updateData.editorImageUrl = await saveBase64Image(data.editorImageUrl);
  }

  const design = await prisma.design.update({
    where: { id },
    data: updateData,
  });
  revalidatePath('/designs');
  return design;
}

export async function deleteDesign(id: string) {
  await prisma.design.delete({
    where: { id },
  });
  revalidatePath('/designs');
}
