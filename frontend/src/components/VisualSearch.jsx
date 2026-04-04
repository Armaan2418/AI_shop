import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VisualSearch.css';

const FAKE_RESULTS = [
  'Analyzing image pixels...',
  'Detecting product category...',
  'Matching visual patterns with AI...',
  'Found 6 similar products!',
];

export default function VisualSearch() {
  const navigate = useNavigate();
  const [open,       setOpen]       = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing,  setAnalyzing]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [statusText, setStatusText] = useState('');
  const [done,       setDone]       = useState(false);
  const fileRef = useRef(null);
  const intervalRef = useRef(null);

  const handleClose = () => {
    clearInterval(intervalRef.current);
    setOpen(false);
    setDragging(false);
    setPreviewUrl(null);
    setAnalyzing(false);
    setProgress(0);
    setStatusText('');
    setDone(false);
  };

  // Listen for global open event fired by Navbar
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('aishop:open-visual-search', handler);
    return () => window.removeEventListener('aishop:open-visual-search', handler);
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);



  const startAnalysis = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAnalyzing(true);
    setProgress(0);
    setDone(false);

    // Progress animation
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) { p = 100; clearInterval(intervalRef.current); }
      setProgress(Math.min(p, 100));
      const idx = Math.min(Math.floor((p / 100) * (FAKE_RESULTS.length - 1)), FAKE_RESULTS.length - 1);
      setStatusText(FAKE_RESULTS[idx]);
      if (p >= 100) {
        setStatusText(FAKE_RESULTS[FAKE_RESULTS.length - 1]);
        setDone(true);
        setTimeout(() => {
          handleClose();
          navigate('/products?sort=featured');
        }, 1400);
      }
    }, 180);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    startAnalysis(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
  };

  if (!open) return null;

  return (
    <div className="vs-overlay" onClick={handleClose}>
      <div className="vs-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="vs-modal__header">
          <div className="vs-modal__title">
            <span className="vs-modal__title-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </span>
            AI Visual Search
          </div>
          <p className="vs-modal__sub">Upload a photo — our AI will find similar products instantly</p>
          <button className="vs-modal__close" onClick={handleClose}>✕</button>
        </div>

        {/* Upload Zone */}
        {!analyzing && (
          <div
            className={`vs-dropzone ${dragging ? 'vs-dropzone--drag' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="vs-file-input"
              onChange={handleInputChange}
            />
            <div className="vs-dropzone__icon">
              <div className="vs-dropzone__icon-ring" />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="vs-dropzone__title">
              {dragging ? 'Drop image here!' : 'Drag & drop an image'}
            </p>
            <p className="vs-dropzone__sub">or click to browse — JPG, PNG, WEBP supported</p>
            <div className="vs-dropzone__tips">
              <span>💡 Tip: Photo of shoes, bags, phones, clothing all work!</span>
            </div>
          </div>
        )}

        {/* Analysis state */}
        {analyzing && (
          <div className="vs-analyzing">
            <div className="vs-analyzing__img-wrap">
              {previewUrl && (
                <img src={previewUrl} alt="Uploaded" className="vs-analyzing__img" />
              )}
              {!done && <div className="vs-analyzing__scan-line" />}
              {done && (
                <div className="vs-analyzing__done-overlay">
                  <span className="vs-done-check">✓</span>
                </div>
              )}
            </div>

            <div className="vs-analyzing__info">
              <div className="vs-ai-label">
                <span className={`vs-ai-dot ${done ? 'vs-ai-dot--done' : ''}`} />
                {done ? 'Analysis complete' : 'AI Vision analyzing...'}
              </div>

              <p className="vs-status-text">{statusText || FAKE_RESULTS[0]}</p>

              {/* Progress bar */}
              <div className="vs-progress">
                <div className="vs-progress__bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="vs-progress__labels">
                <span>0%</span>
                <span className="vs-progress__pct">{Math.round(progress)}%</span>
                <span>100%</span>
              </div>

              {done && (
                <div className="vs-result">
                  <span className="vs-result__icon">🎯</span>
                  <span className="vs-result__text">Found 6 similar products! Redirecting...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chips */}
        {!analyzing && (
          <div className="vs-chips">
            <p className="vs-chips__label">Or try searching for:</p>
            <div className="vs-chips__list">
              {['Wireless headphones', 'Running shoes', 'Leather handbag', 'Smartwatch', 'Laptop'].map(chip => (
                <button key={chip} className="vs-chip" onClick={() => { handleClose(); navigate(`/products?search=${encodeURIComponent(chip)}`); }}>
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
