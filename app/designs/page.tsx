'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDesigns, deleteDesign } from '../actions';
import { useDesignStore } from './store';

export default function DesignsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { designs, setDesigns } = useDesignStore();

  useEffect(() => {
    async function load() {
      const data = await getDesigns();
      setDesigns(data as any);
      setLoading(false);
    }
    load();
  }, [setDesigns]);

  const handleCreate = () => {
    router.push('/');
  };

  const handleEdit = (id: string) => {
    router.push(`/designs/${id}`);
  };

  const handlePreview = (id: string) => {
    router.push(`/designs/${id}/preview`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    setDeleting(id);
    await deleteDesign(id);
    const data = await getDesigns();
    setDesigns(data as any);
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="designs-page">
        <div className="designs-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="designs-page">
      <header className="designs-header">
        <h1>My Designs</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Design
        </button>
      </header>

      <main className="designs-main">
        {designs.length === 0 ? (
          <div className="designs-empty">
            <p>No designs yet. Create your first phone case design!</p>
            <button className="btn" onClick={handleCreate}>
              Create Design
            </button>
          </div>
        ) : (
          <div className="designs-grid">
            {designs.map((design) => (
              <div key={design.id} className="design-card">
                <div className="design-preview">
                  {design.editorImageUrl ? (
                    <img src={design.editorImageUrl} alt={design.name} />
                  ) : design.imageUrl ? (
                    <img src={design.imageUrl} alt={design.name} />
                  ) : (
                    <div className="design-placeholder">No image</div>
                  )}
                </div>
                <div className="design-info">
                  <h3>{design.name}</h3>
                  <p className="design-color">
                    <span
                      className="color-dot"
                      style={{ backgroundColor: design.caseColor }}
                    />
                    {design.caseColor} - {design.caseFinish}
                  </p>
                </div>
                <div className="design-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePreview(design.id)}
                  >
                    Preview
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleEdit(design.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={deleting === design.id}
                    onClick={() => handleDelete(design.id)}
                  >
                    {deleting === design.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}