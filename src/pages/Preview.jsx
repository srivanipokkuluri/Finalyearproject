import React, { useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);

  const dataUrl = location.state?.dataUrl || "";
  const templateName = location.state?.templateName || "Preview";
  const selectedMusic = location.state?.selectedMusic || null;
  const layers = location.state?.layers || [];

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const downloadName = useMemo(() => {
    const safe = templateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `${safe || "poster"}.png`;
  }, [templateName]);

  const toggleMusic = () => {
    if (!audioRef.current || !selectedMusic) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const exportWithMusic = async () => {
    // Simulate export with music
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = selectedMusic 
      ? `Exporting video with "${selectedMusic.name}"...` 
      : 'Exporting video...';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-sm font-semibold text-slate-900">Preview</div>
            <div className="mt-1 text-xs text-slate-500">{templateName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <Link
              to="/templates"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Templates
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {dataUrl ? (
              <img alt="Final output" src={dataUrl} className="w-full rounded-xl border border-slate-200" />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                Nothing to preview yet. Go back to the editor and click Preview.
              </div>
            )}
          </section>

          <aside className="space-y-4">
            {/* Music Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-900">🎵 Background Music</div>
              <div className="mt-1 text-xs text-slate-500">Audio for your video</div>
              
              {selectedMusic ? (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-slate-900">{selectedMusic.name}</div>
                    <div className="text-xs text-slate-500">
                      {selectedMusic.artist} • {selectedMusic.mood} • {selectedMusic.duration}s
                    </div>
                  </div>

                  {/* Play/Pause Button */}
                  <button
                    onClick={toggleMusic}
                    className="w-full py-2 px-4 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Pause' : 'Play'} Music
                  </button>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">Volume</span>
                      <span className="text-xs text-slate-500">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center py-6 text-sm text-slate-500">
                  No music selected. Go back to editor to add background music.
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-900">Export Options</div>
              <div className="mt-1 text-xs text-slate-500">Download your creation</div>
              
              <div className="mt-4 space-y-3">
                <a
                  href={dataUrl}
                  download={downloadName}
                  className="block w-full py-2 px-4 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg hover:bg-slate-50 text-center"
                >
                  📷 Download Image
                </a>
                
                <button
                  onClick={exportWithMusic}
                  className="w-full py-2 px-4 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800"
                >
                  🎬 Export Video {selectedMusic ? 'with Music' : ''}
                </button>
              </div>
            </div>

            {/* Video Info */}
            {layers.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-900">Project Info</div>
                <div className="mt-1 text-xs text-slate-500">Video details</div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Layers:</span>
                    <span className="font-medium text-slate-900">{layers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Text Layers:</span>
                    <span className="font-medium text-slate-900">
                      {layers.filter(l => l.type === 'text').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Image Layers:</span>
                    <span className="font-medium text-slate-900">
                      {layers.filter(l => l.type === 'image').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={selectedMusic?.fullUrl} 
        loop 
        preload="none"
      />
    </div>
  );
}
