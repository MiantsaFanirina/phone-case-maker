'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
  const design = await prisma.design.create({
    data: {
      name: data.name,
      caseColor: data.caseColor || '#DFCEEA',
      caseFinish: data.caseFinish || 'glossy',
      imageUrl: data.imageUrl || null,
      editorImageUrl: data.editorImageUrl || null,
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
  return prisma.design.findUnique({
    where: { id },
  });
}

export async function getDesigns() {
  return prisma.design.findMany({
    orderBy: { updatedAt: 'desc' },
  });
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
  const design = await prisma.design.update({
    where: { id },
    data,
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