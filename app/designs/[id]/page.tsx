import { notFound } from 'next/navigation';
import { getDesign } from '../../actions';
import EditDesignContent from './EditDesignContent';

export default async function Page({ params }: { params: { id: string } }) {
  const design = await getDesign(params.id);
  if (!design) notFound();

  return (
    <EditDesignContent
      design={{
        id: design.id,
        name: design.name,
        caseColor: design.caseColor,
        caseFinish: design.caseFinish,
        imageUrl: design.imageUrl,
        editorImageUrl: design.editorImageUrl,
        positionX: design.positionX,
        positionY: design.positionY,
        scale: design.scale,
        rotation: design.rotation,
        opacity: design.opacity,
      }}
    />
  );
}
