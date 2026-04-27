'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDesigns, deleteDesign, createDesign } from '../actions';
import { useDesignStore } from './store';
import { useStore } from '../store';
import LoadingPage from '../components/LoadingPage';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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
    setShowNewDialog(true);
  };

  const handleCreateSubmit = () => {
    if (!newName.trim()) return;
    sessionStorage.setItem('newDesignName', newName.trim());
    // Clear both stores before navigating to create page
    useDesignStore.getState().setDesigns([]);
    useDesignStore.getState().setCurrentDesign(null);
    useStore.getState().reset();
    router.push('/create');
    setShowNewDialog(false);
    setNewName('');
  };

  const handleEdit = (id: string) => {
    router.push(`/designs/${id}`);
  };

  const handlePreview = (id: string) => {
    router.push(`/designs/${id}/preview`);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(deleteConfirmId);
    await deleteDesign(deleteConfirmId);
    const data = await getDesigns();
    setDesigns(data as any);
    setDeleting(null);
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  if (loading) {
    return <LoadingPage message="Loading designs ..." />;
  }

  return (
    <div className="designs-page">
      <header className="designs-header">
        <h1>My Designs</h1>
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
                  {design.imageUrl ? (
                    <img src={design.imageUrl} alt={design.name} />
                  ) : design.editorImageUrl ? (
                    <img src={design.editorImageUrl} alt={design.name} />
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
                    {deleting === design.id ? 'Deleting ...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNewDialog && (
        <div className="dialog-overlay" onClick={() => setShowNewDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>New Design</h2>
            <div className="form-group">
              <label>Design Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter design name"
                autoFocus
              />
            </div>
            <div className="dialog-actions">
              <button className="btn" onClick={() => setShowNewDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateSubmit}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="dialog-overlay" onClick={handleCancelDelete}>
          <div className="dialog dialog-sm" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Design?</h2>
            <p className="dialog-message">
              Are you sure you want to delete this design? This action cannot be undone.
            </p>
            <div className="dialog-actions">
              <button className="btn" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                {deleting === deleteConfirmId ? 'Deleting ...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}