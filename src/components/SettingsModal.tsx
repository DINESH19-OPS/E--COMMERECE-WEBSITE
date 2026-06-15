'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Settings } from 'lucide-react';

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { globalPreviewEnabled, setGlobalPreviewEnabled, allowGeolocation, setAllowGeolocation, clearPinnedPreviews } = useApp();
  const [localPreview, setLocalPreview] = useState(globalPreviewEnabled);
  const [localGeo, setLocalGeo] = useState(allowGeolocation);

  if (!open) return null;

  const save = () => {
    setGlobalPreviewEnabled(localPreview);
    setAllowGeolocation(localGeo);
    onClose();
  };

  return (
    <div className="settings-modal-backdrop" role="dialog" aria-modal="true">
      <div className="settings-modal glass">
        <div className="settings-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={18} />
            <h3>Settings</h3>
          </div>
          <button aria-label="Close settings" className="btn btn-ghost" onClick={onClose}><X /></button>
        </div>

        <div className="settings-row">
          <label className="settings-label">Enable product previews</label>
          <div>
            <label className="switch">
              <input type="checkbox" checked={localPreview} onChange={(e) => setLocalPreview(e.target.checked)} />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="settings-row">
          <label className="settings-label">Allow geolocation</label>
          <div>
            <label className="switch">
              <input type="checkbox" checked={localGeo} onChange={(e) => setLocalGeo(e.target.checked)} />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="settings-row">
          <label className="settings-label">Pinned previews</label>
          <div>
            <button className="btn btn-outline btn-sm" onClick={() => { clearPinnedPreviews(); }}>
              Clear pinned previews
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
