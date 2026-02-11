import React, { useState, useEffect, useRef, useCallback } from 'react';
import { musicService } from '../services/musicService';

export default function MusicPanel({ onMusicSelect, videoDuration, videoFrames }) {
  const [mode, setMode] = useState('system'); // 'system', 'ai', or 'upload'
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTempo, setSelectedTempo] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [systemMusic, setSystemMusic] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [currentPreviewTrack, setCurrentPreviewTrack] = useState(null);
  const [appliedTrack, setAppliedTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [userAudioFile, setUserAudioFile] = useState(null);
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const moods = ['happy', 'cinematic', 'energetic', 'emotional', 'professional'];
  const tempos = ['slow', 'medium', 'fast'];
  const genres = ['pop', 'instrumental', 'electronic', 'cinematic', 'rock', 'jazz', 'classical'];

  const loadSystemMusic = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        mood: selectedMood,
        tempo: selectedTempo,
        genre: selectedGenre
      };
      const music = await musicService.getSystemMusic(filters);
      setSystemMusic(music);
    } catch (error) {
      console.error('Error loading system music:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMood, selectedTempo, selectedGenre]);

  useEffect(() => {
    if (mode === 'system') {
      loadSystemMusic();
    }
  }, [mode, loadSystemMusic]);

  const getAIRecommendations = async () => {
    setIsLoading(true);
    try {
      const analysis = await musicService.analyzeVideoContent(videoFrames);
      setAiAnalysis(analysis);
      
      const recommendations = await musicService.getAIRecommendations(analysis, videoDuration);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startPreview = async (track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setCurrentPreviewTrack(track);
    setIsPreviewing(true);
    
    if (audioRef.current) {
      try {
        audioRef.current.src = track.previewUrl;
        audioRef.current.volume = volume;
        
        // Wait for audio to be ready before playing
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio started playing successfully
            })
            .catch((error) => {
              console.error('Audio play failed:', error);
              setIsPreviewing(false);
              setCurrentPreviewTrack(null);
            });
        }
        
        audioRef.current.onended = () => {
          setIsPreviewing(false);
          setCurrentPreviewTrack(null);
        };
        
        audioRef.current.onerror = () => {
          console.error('Audio loading error');
          setIsPreviewing(false);
          setCurrentPreviewTrack(null);
        };
      } catch (error) {
        console.error('Error starting preview:', error);
        setIsPreviewing(false);
        setCurrentPreviewTrack(null);
      }
    }
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPreviewing(false);
    setCurrentPreviewTrack(null);
  };

  const applyMusic = async (track) => {
    try {
      const syncedTrack = await musicService.syncWithVideo(track, videoDuration);
      setAppliedTrack(syncedTrack);
      onMusicSelect(syncedTrack);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `Applied: ${track.name}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Error applying music:', error);
    }
  };

  const regenerateRecommendations = () => {
    getAIRecommendations();
  };

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      const userTrack = {
        id: 'user_upload',
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        artist: 'User Upload',
        mood: 'custom',
        tempo: 'medium',
        genre: 'custom',
        duration: 0, // Will be updated when audio loads
        bpm: 120,
        energy: 0.5,
        valence: 0.5,
        previewUrl: url,
        fullUrl: url,
        tags: ['user', 'upload', 'custom']
      };
      setUserAudioFile(userTrack);
      setMode('upload');
      
      // Get audio duration
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        userTrack.duration = Math.round(audio.duration);
        setUserAudioFile({...userTrack});
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold text-slate-900">🎵 Music</div>
          <div className="mt-1 text-xs text-slate-500">Add background music to your video</div>
        </div>
        {appliedTrack && (
          <div className="flex items-center gap-2">
            <div className="text-xs text-green-600 font-medium">✓ {appliedTrack.name}</div>
            <button
              onClick={() => {
                setAppliedTrack(null);
                onMusicSelect(null);
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Mode Selection */}
      <div className="space-y-3 mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="musicMode"
            value="system"
            checked={mode === 'system'}
            onChange={(e) => setMode(e.target.value)}
            className="w-4 h-4 text-slate-900"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">Use System Library</div>
            <div className="text-xs text-slate-500">Browse our music library</div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="musicMode"
            value="ai"
            checked={mode === 'ai'}
            onChange={(e) => setMode(e.target.value)}
            className="w-4 h-4 text-slate-900"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">AI Automatic Suggestion</div>
            <div className="text-xs text-slate-500">Get AI recommendations</div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="musicMode"
            value="upload"
            checked={mode === 'upload'}
            onChange={(e) => setMode(e.target.value)}
            className="w-4 h-4 text-slate-900"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">Upload Your Audio</div>
            <div className="text-xs text-slate-500">Use your own music file</div>
          </div>
        </label>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* System Music Mode */}
      {mode === 'system' && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="grid grid-cols-3 gap-2">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-slate-400"
            >
              <option value="">All Moods</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>

            <select
              value={selectedTempo}
              onChange={(e) => setSelectedTempo(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-slate-400"
            >
              <option value="">All Tempos</option>
              {tempos.map(tempo => (
                <option key={tempo} value={tempo}>{tempo}</option>
              ))}
            </select>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-slate-400"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Music List */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-sm text-slate-500">Loading music...</div>
            ) : systemMusic.length === 0 ? (
              <div className="text-center py-4 text-sm text-slate-500">No music found</div>
            ) : (
              systemMusic.map(track => (
                <div key={track.id} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{track.name}</div>
                    <div className="text-xs text-slate-500">
                      {track.mood} • {track.tempo} • {track.genre} • {track.duration}s
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => isPreviewing && currentPreviewTrack?.id === track.id ? stopPreview() : startPreview(track)}
                      className="p-1.5 text-xs rounded hover:bg-slate-100"
                    >
                      {isPreviewing && currentPreviewTrack?.id === track.id ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => applyMusic(track)}
                      className="p-1.5 text-xs rounded hover:bg-slate-100"
                      disabled={appliedTrack?.id === track.id}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* AI Recommendation Mode */}
      {mode === 'ai' && (
        <div className="space-y-3">
          {!aiAnalysis ? (
            <button
              onClick={getAIRecommendations}
              disabled={isLoading}
              className="w-full py-2 px-3 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? 'Analyzing video...' : '🤖 Get AI Recommendations'}
            </button>
          ) : (
            <div className="space-y-3">
              {/* AI Analysis Results */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs font-semibold text-slate-900 mb-2">🧠 Video Analysis</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Detected Mood:</span> {aiAnalysis.mood}
                  </div>
                  <div>
                    <span className="font-medium">Energy Level:</span> {aiAnalysis.energy}
                  </div>
                  <div>
                    <span className="font-medium">Pacing:</span> {aiAnalysis.pacing}
                  </div>
                  <div>
                    <span className="font-medium">Content Type:</span> {aiAnalysis.contentType}
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-900">🎵 Recommended Tracks</div>
                  <button
                    onClick={regenerateRecommendations}
                    disabled={isLoading}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    🔄 Regenerate
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-4 text-sm text-slate-500">Getting recommendations...</div>
                ) : (
                  aiRecommendations.map((track, index) => (
                    <div key={track.id} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">
                            {index + 1}. {track.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {track.mood} • {track.tempo} • {track.genre}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => isPreviewing && currentPreviewTrack?.id === track.id ? stopPreview() : startPreview(track)}
                            className="p-1.5 text-xs rounded hover:bg-slate-100"
                          >
                            {isPreviewing && currentPreviewTrack?.id === track.id ? '⏸️' : '▶️'}
                          </button>
                          <button
                            onClick={() => applyMusic(track)}
                            className="p-1.5 text-xs rounded hover:bg-slate-100"
                            disabled={appliedTrack?.id === track.id}
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                      
                      {/* AI Reasoning */}
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        <strong>Why this track:</strong> {track.aiReasoning}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-3">
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-900 mb-2">📁 Upload Your Audio File</div>
              <div className="text-xs text-slate-500">Supports MP3, WAV, M4A, OGG formats</div>
            </div>
            
            <button
              onClick={triggerFileUpload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800"
            >
              📤 Choose Audio File
            </button>
            
            {userAudioFile && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-900 mb-2">🎵 Your Audio</div>
                <div className="text-xs text-slate-500 mb-2">
                  {userAudioFile.name} • {userAudioFile.duration}s
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => isPreviewing && currentPreviewTrack?.id === userAudioFile.id ? stopPreview() : startPreview(userAudioFile)}
                    className="p-1.5 text-xs rounded hover:bg-slate-100"
                  >
                    {isPreviewing && currentPreviewTrack?.id === userAudioFile.id ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={() => applyMusic(userAudioFile)}
                    className="p-1.5 text-xs rounded hover:bg-slate-100"
                    disabled={appliedTrack?.id === userAudioFile.id}
                  >
                    ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volume Control */}
      {appliedTrack && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-700">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1"
            />
            <span className="text-xs text-slate-500 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
