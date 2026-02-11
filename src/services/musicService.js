// Music Database Schema and Service
// This file handles music data, AI recommendations, and audio-video synchronization

// Mock Music Database
const musicDatabase = [
  {
    id: 'track_001',
    name: 'Uplifting Corporate',
    artist: 'Studio Masters',
    mood: 'professional',
    tempo: 'medium',
    genre: 'instrumental',
    duration: 120,
    bpm: 120,
    energy: 0.6,
    valence: 0.8,
    language: 'english',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['corporate', 'business', 'uplifting', 'motivational']
  },
  {
    id: 'track_002',
    name: 'Summer Vibes',
    artist: 'Tropical House',
    mood: 'happy',
    tempo: 'medium',
    genre: 'pop',
    duration: 150,
    bpm: 128,
    energy: 0.7,
    valence: 0.9,
    language: 'english',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    tags: ['summer', 'beach', 'party', 'upbeat']
  },
  {
    id: 'track_003',
    name: 'Epic Cinematic Intro',
    artist: 'Movie Scores',
    mood: 'cinematic',
    tempo: 'slow',
    genre: 'cinematic',
    duration: 90,
    bpm: 80,
    energy: 0.8,
    valence: 0.6,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    tags: ['epic', 'dramatic', 'intro', 'powerful']
  },
  {
    id: 'track_004',
    name: 'Acoustic Morning',
    artist: 'Folk Dreams',
    mood: 'emotional',
    tempo: 'slow',
    genre: 'instrumental',
    duration: 180,
    bpm: 75,
    energy: 0.3,
    valence: 0.7,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    tags: ['acoustic', 'morning', 'calm', 'reflective']
  },
  {
    id: 'track_005',
    name: 'Electronic Dance Party',
    artist: 'DJ Beats',
    mood: 'energetic',
    tempo: 'fast',
    genre: 'electronic',
    duration: 200,
    bpm: 140,
    energy: 0.9,
    valence: 0.8,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    tags: ['dance', 'party', 'club', 'energetic']
  },
  {
    id: 'track_006',
    name: 'Jazz Café',
    artist: 'Smooth Jazz Trio',
    mood: 'professional',
    tempo: 'slow',
    genre: 'jazz',
    duration: 160,
    bpm: 85,
    energy: 0.4,
    valence: 0.6,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    tags: ['jazz', 'cafe', 'smooth', 'relaxing']
  },
  {
    id: 'track_007',
    name: 'Birthday Celebration',
    artist: 'Party Band',
    mood: 'happy',
    tempo: 'fast',
    genre: 'pop',
    duration: 120,
    bpm: 130,
    energy: 0.8,
    valence: 0.9,
    language: 'english',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    tags: ['birthday', 'celebration', 'party', 'fun']
  },
  {
    id: 'track_008',
    name: 'Travel Adventure',
    artist: 'World Music',
    mood: 'cinematic',
    tempo: 'medium',
    genre: 'instrumental',
    duration: 140,
    bpm: 110,
    energy: 0.7,
    valence: 0.8,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    tags: ['travel', 'adventure', 'world', 'exploration']
  },
  {
    id: 'track_009',
    name: 'Motivational Speech',
    artist: 'Corporate Audio',
    mood: 'professional',
    tempo: 'medium',
    genre: 'instrumental',
    duration: 100,
    bpm: 115,
    energy: 0.6,
    valence: 0.7,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    tags: ['motivational', 'speech', 'corporate', 'inspiring']
  },
  {
    id: 'track_010',
    name: 'Rock Anthem',
    artist: 'Electric Band',
    mood: 'energetic',
    tempo: 'fast',
    genre: 'rock',
    duration: 180,
    bpm: 145,
    energy: 0.9,
    valence: 0.7,
    language: 'english',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    tags: ['rock', 'anthem', 'powerful', 'energetic']
  },
  {
    id: 'track_011',
    name: 'Classical Symphony',
    artist: 'Orchestra',
    mood: 'cinematic',
    tempo: 'slow',
    genre: 'classical',
    duration: 240,
    bpm: 70,
    energy: 0.5,
    valence: 0.6,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    tags: ['classical', 'symphony', 'orchestra', 'elegant']
  },
  {
    id: 'track_012',
    name: 'Tutorial Background',
    artist: 'Education Audio',
    mood: 'professional',
    tempo: 'slow',
    genre: 'instrumental',
    duration: 300,
    bpm: 90,
    energy: 0.3,
    valence: 0.5,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    tags: ['tutorial', 'education', 'background', 'learning']
  },
  // Multi-language tracks
  {
    id: 'track_013',
    name: 'Bollywood Celebration',
    artist: 'Indian Orchestra',
    mood: 'happy',
    tempo: 'fast',
    genre: 'world',
    duration: 180,
    bpm: 120,
    energy: 0.8,
    valence: 0.9,
    language: 'hindi',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    tags: ['bollywood', 'celebration', 'indian', 'festive']
  },
  {
    id: 'track_014',
    name: 'K-Pop Energy',
    artist: 'Seoul Beats',
    mood: 'energetic',
    tempo: 'fast',
    genre: 'pop',
    duration: 150,
    bpm: 128,
    energy: 0.9,
    valence: 0.8,
    language: 'korean',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    tags: ['kpop', 'korean', 'energetic', 'modern']
  },
  {
    id: 'track_015',
    name: 'Latin Fiesta',
    artist: 'Salsa Masters',
    mood: 'happy',
    tempo: 'fast',
    genre: 'latin',
    duration: 200,
    bpm: 130,
    energy: 0.8,
    valence: 0.9,
    language: 'spanish',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    tags: ['latin', 'salsa', 'fiesta', 'dance']
  },
  {
    id: 'track_016',
    name: 'French Café',
    artist: 'Paris Ensemble',
    mood: 'emotional',
    tempo: 'slow',
    genre: 'jazz',
    duration: 160,
    bpm: 75,
    energy: 0.4,
    valence: 0.7,
    language: 'french',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    tags: ['french', 'cafe', 'romantic', 'elegant']
  },
  {
    id: 'track_017',
    name: 'Japanese Zen Garden',
    artist: 'Tokyo Artists',
    mood: 'professional',
    tempo: 'slow',
    genre: 'ambient',
    duration: 240,
    bpm: 70,
    energy: 0.3,
    valence: 0.6,
    language: 'instrumental',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    tags: ['japanese', 'zen', 'meditation', 'peaceful']
  },
  {
    id: 'track_018',
    name: 'Arabic Nights',
    artist: 'Desert Orchestra',
    mood: 'cinematic',
    tempo: 'medium',
    genre: 'world',
    duration: 180,
    bpm: 110,
    energy: 0.7,
    valence: 0.6,
    language: 'arabic',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    fullUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    tags: ['arabic', 'middle-eastern', 'cinematic', 'dramatic']
  }
];

// AI Analysis Functions
class VideoAnalyzer {
  static async analyzeVideoContent(videoFrames) {
    // Simulate AI video analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        const analysis = {
          mood: this.detectMood(videoFrames),
          energy: this.detectEnergy(videoFrames),
          pacing: this.detectPacing(videoFrames),
          contentType: this.detectContentType(videoFrames),
          brightness: this.calculateBrightness(videoFrames),
          sceneChanges: this.countSceneChanges(videoFrames),
          facialExpressions: this.detectFacialExpressions(videoFrames),
          colorPalette: this.extractColorPalette(videoFrames),
          culturalContext: this.detectCulturalContext(videoFrames),
          languagePreference: this.detectLanguagePreference(videoFrames)
        };
        resolve(analysis);
      }, 1500); // Simulate processing time
    });
  }

  static detectMood(frames) {
    // Simulate mood detection based on visual analysis
    const moods = ['happy', 'cinematic', 'emotional', 'energetic', 'professional'];
    const weights = [0.3, 0.2, 0.15, 0.25, 0.1];
    const randomIndex = this.weightedRandom(weights);
    return moods[randomIndex];
  }

  static detectEnergy(frames) {
    // Simulate energy level detection
    const energies = ['low', 'medium', 'high'];
    const weights = [0.2, 0.5, 0.3];
    const randomIndex = this.weightedRandom(weights);
    return energies[randomIndex];
  }

  static detectPacing(frames) {
    // Simulate pacing detection based on scene changes
    const pacing = ['slow', 'medium', 'fast'];
    const weights = [0.3, 0.4, 0.3];
    const randomIndex = this.weightedRandom(weights);
    return pacing[randomIndex];
  }

  static detectContentType(frames) {
    // Simulate content type detection
    const types = ['travel', 'promo', 'birthday', 'vlog', 'tutorial', 'celebration'];
    const weights = [0.2, 0.15, 0.15, 0.25, 0.15, 0.1];
    const randomIndex = this.weightedRandom(weights);
    return types[randomIndex];
  }

  static detectCulturalContext(frames) {
    // Analyze visual elements for cultural context
    const contexts = ['western', 'asian', 'middle-eastern', 'latin', 'african', 'global'];
    const weights = [0.3, 0.2, 0.15, 0.15, 0.1, 0.1];
    const randomIndex = this.weightedRandom(weights);
    return contexts[randomIndex];
  }

  static detectLanguagePreference(frames) {
    // Detect language preference based on visual cues
    const culturalContext = this.detectCulturalContext(frames);
    const contentType = this.detectContentType(frames);
    
    // Language mapping based on cultural context and content type
    const languageMap = {
      'western': ['english', 'french', 'spanish', 'german'],
      'asian': ['korean', 'japanese', 'hindi', 'mandarin', 'instrumental'],
      'middle-eastern': ['arabic', 'instrumental'],
      'latin': ['spanish', 'portuguese', 'instrumental'],
      'african': ['instrumental'],
      'global': ['english', 'instrumental']
    };

    const possibleLanguages = languageMap[culturalContext] || ['english', 'instrumental'];
    
    // Add content type bias
    let languageWeights = {};
    possibleLanguages.forEach(lang => {
      languageWeights[lang] = 1.0;
    });

    // Boost certain languages based on content type
    if (contentType === 'celebration') {
      languageWeights['hindi'] = (languageWeights['hindi'] || 1.0) * 1.5;
      languageWeights['spanish'] = (languageWeights['spanish'] || 1.0) * 1.3;
    } else if (contentType === 'travel') {
      languageWeights['instrumental'] = (languageWeights['instrumental'] || 1.0) * 1.4;
    } else if (contentType === 'promo') {
      languageWeights['english'] = (languageWeights['english'] || 1.0) * 1.3;
    }

    // Select language based on weights
    const languages = Object.keys(languageWeights);
    const weights = Object.values(languageWeights);
    const selectedIndex = this.weightedRandom(weights);
    
    return languages[selectedIndex];
  }

  static calculateBrightness(frames) {
    // Simulate brightness calculation
    return Math.random() * 0.8 + 0.2; // 0.2 to 1.0
  }

  static countSceneChanges(frames) {
    // Simulate scene change detection
    return Math.floor(Math.random() * 10) + 1; // 1 to 10 changes
  }

  static detectFacialExpressions(frames) {
    // Simulate facial expression detection
    const expressions = ['positive', 'neutral', 'mixed'];
    const weights = [0.4, 0.3, 0.3];
    const randomIndex = this.weightedRandom(weights);
    return expressions[randomIndex];
  }

  static extractColorPalette(frames) {
    // Simulate color palette extraction
    return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  }

  static weightedRandom(weights) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) return i;
    }
    return weights.length - 1;
  }
}

// Music Recommendation Engine
class MusicRecommendationEngine {
  static async getRecommendations(videoAnalysis, videoDuration) {
    const { mood, energy, languagePreference } = videoAnalysis;
    
    // Filter music based on analysis
    let candidates = musicDatabase.filter(track => {
      // Match mood
      if (track.mood !== mood) return false;
      
      // Match energy level
      const trackEnergy = track.energy > 0.7 ? 'high' : track.energy > 0.4 ? 'medium' : 'low';
      if (trackEnergy !== energy) return false;
      
      // Prioritize language preference
      if (languagePreference && track.language !== languagePreference) {
        // Still include other languages but with lower priority
        return track.language === 'instrumental' || track.language === 'english';
      }
      
      return true;
    });

    // If no exact matches, relax criteria
    if (candidates.length < 3) {
      candidates = musicDatabase.filter(track => {
        // Only match mood and energy
        return track.mood === mood && 
               ((track.energy > 0.7 && energy === 'high') ||
                (track.energy > 0.4 && track.energy <= 0.7 && energy === 'medium') ||
                (track.energy <= 0.4 && energy === 'low'));
      });
    }

    // If still no matches, use all tracks
    if (candidates.length < 3) {
      candidates = [...musicDatabase];
    }

    // Score and rank candidates
    const scoredCandidates = candidates.map(track => ({
      ...track,
      score: this.calculateRelevanceScore(track, videoAnalysis, videoDuration),
      reasoning: this.generateReasoning(track, videoAnalysis)
    }));

    // Sort by score and return top 3
    scoredCandidates.sort((a, b) => b.score - a.score);
    
    return scoredCandidates.slice(0, 3);
  }

  static calculateRelevanceScore(track, analysis, videoDuration) {
    let score = 50; // Base score
    
    // Mood matching (30% weight)
    if (track.mood === analysis.mood) {
      score += 30;
    }
    
    // Energy matching (20% weight)
    const trackEnergy = track.energy > 0.7 ? 'high' : track.energy > 0.4 ? 'medium' : 'low';
    if (trackEnergy === analysis.energy) {
      score += 20;
    }
    
    // Language preference matching (25% weight)
    if (analysis.languagePreference && track.language === analysis.languagePreference) {
      score += 25;
    } else if (track.language === 'instrumental') {
      score += 15; // Instrumental tracks are universally compatible
    } else if (track.language === 'english') {
      score += 10; // English is widely understood
    }
    
    // Duration compatibility (15% weight)
    const durationRatio = track.duration / videoDuration;
    if (durationRatio >= 0.8 && durationRatio <= 1.2) score += 15;
    else if (durationRatio >= 0.6 && durationRatio <= 1.5) score += 8;
    
    // Cultural context bonus (10% weight)
    const culturalBonus = this.getCulturalBonus(track, analysis.culturalContext);
    score += culturalBonus;
    
    return score;
  }

  static getCulturalBonus(track, culturalContext) {
    const bonuses = {
      'western': { 'english': 10, 'french': 8, 'spanish': 8, 'rock': 7, 'pop': 6 },
      'asian': { 'korean': 10, 'japanese': 9, 'hindi': 10, 'instrumental': 8 },
      'middle-eastern': { 'arabic': 10, 'instrumental': 8 },
      'latin': { 'spanish': 10, 'latin': 10, 'instrumental': 7 },
      'african': { 'instrumental': 10 },
      'global': { 'instrumental': 10, 'english': 8 }
    };
    
    return bonuses[culturalContext]?.[track.language] || bonuses[culturalContext]?.['instrumental'] || 3;
  }

  static generateReasoning(track, analysis) {
    const reasons = [];
    
    if (track.mood === analysis.mood) {
      reasons.push(`matches ${analysis.mood} mood of your video`);
    }
    
    if (track.energy > 0.7 && analysis.energy === 'high') {
      reasons.push(`high energy level complements fast pacing`);
    } else if (track.energy < 0.4 && analysis.energy === 'low') {
      reasons.push(`gentle energy suits calm atmosphere`);
    }
    
    // Language-based reasoning
    if (analysis.languagePreference && track.language === analysis.languagePreference) {
      if (track.language === 'hindi') {
        reasons.push(`perfect for celebration content with Bollywood style`);
      } else if (track.language === 'korean') {
        reasons.push(`modern K-pop energy matches your video vibe`);
      } else if (track.language === 'spanish') {
        reasons.push(`Latin rhythm adds festive atmosphere`);
      } else if (track.language === 'french') {
        reasons.push(`elegant French style enhances sophistication`);
      } else if (track.language === 'arabic') {
        reasons.push(`rich Middle Eastern tones complement your content`);
      } else if (track.language === 'instrumental') {
        reasons.push(`instrumental track won't distract from visuals`);
      }
    }
    
    // Cultural context reasoning
    if (analysis.culturalContext && track.language !== 'english') {
      reasons.push(`cultural context matches your visual style`);
    }
    
    // Generic genre-based reasoning
    if (track.genre === 'pop') {
      reasons.push(`upbeat pop style works well for most content`);
    } else if (track.genre === 'electronic') {
      reasons.push(`modern electronic sound adds contemporary feel`);
    } else if (track.genre === 'cinematic') {
      reasons.push(`dramatic cinematic style enhances visual impact`);
    } else if (track.genre === 'world') {
      reasons.push(`world music adds authentic cultural flavor`);
    }
    
    return reasons.join(', ') + '.';
  }
}
// Audio-Video Synchronization
class AudioVideoSync {
  static async syncWithVideo(track, videoDuration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const syncedTrack = {
          ...track,
          syncedDuration: videoDuration,
          adjustments: this.calculateAdjustments(track, videoDuration),
          beatMarkers: this.generateBeatMarkers(track, videoDuration),
          fadeInOut: this.calculateFadeInOut(track, videoDuration)
        };
        resolve(syncedTrack);
      }, 800); // Simulate processing time
    });
  }

  static calculateAdjustments(track, videoDuration) {
    const adjustments = {
      pitch: 0, // No pitch change
      tempo: 0,  // No tempo change
      volume: 0.7 // Default volume
    };

    const durationRatio = track.duration / videoDuration;
    
    if (durationRatio > 1.5) {
      // Track is much longer, suggest trimming
      adjustments.action = 'trim';
      adjustments.trimPoint = videoDuration;
    } else if (durationRatio < 0.7) {
      // Track is shorter, suggest looping
      adjustments.action = 'loop';
      adjustments.loopCount = Math.ceil(videoDuration / track.duration);
    } else {
      // Good duration match
      adjustments.action = 'none';
    }

    return adjustments;
  }

  static generateBeatMarkers(track, videoDuration) {
    // Generate beat markers for synchronization
    const beatMarkers = [];
    const beatsPerSecond = track.bpm / 60;
    const totalBeats = Math.floor(videoDuration * beatsPerSecond);
    
    for (let i = 0; i < totalBeats; i++) {
      const timestamp = (i / beatsPerSecond);
      beatMarkers.push({
        timestamp,
        beat: i % 4 + 1, // 1-4 beat pattern
        intensity: i % 4 === 0 ? 'strong' : 'weak' // Downbeat stronger
      });
    }
    
    return beatMarkers;
  }

  static calculateFadeInOut(track, videoDuration) {
    return {
      fadeIn: 2.0, // 2 second fade in
      fadeOut: 2.0, // 2 second fade out
      crossfade: 0.5 // 0.5 second crossfade for loops
    };
  }
}

// Main Music Service
export const musicService = {
  // System Music Functions
  async getSystemMusic(filters = {}) {
    let filteredMusic = [...musicDatabase];
    
    // Apply filters
    if (filters.mood) {
      filteredMusic = filteredMusic.filter(track => track.mood === filters.mood);
    }
    
    if (filters.tempo) {
      filteredMusic = filteredMusic.filter(track => track.tempo === filters.tempo);
    }
    
    if (filters.genre) {
      filteredMusic = filteredMusic.filter(track => track.genre === filters.genre);
    }
    
    // Shuffle for variety
    return filteredMusic.sort(() => Math.random() - 0.5);
  },

  // AI Recommendation Functions
  async analyzeVideoContent(videoFrames) {
    return await VideoAnalyzer.analyzeVideoContent(videoFrames);
  },

  async getAIRecommendations(videoAnalysis, videoDuration) {
    return await MusicRecommendationEngine.getRecommendations(videoAnalysis, videoDuration);
  },

  // Audio-Video Sync Functions
  async syncWithVideo(track, videoDuration) {
    return await AudioVideoSync.syncWithVideo(track, videoDuration);
  },

  // Utility Functions
  getMusicById(id) {
    return musicDatabase.find(track => track.id === id);
  },

  getAllMoods() {
    return [...new Set(musicDatabase.map(track => track.mood))];
  },

  getAllGenres() {
    return [...new Set(musicDatabase.map(track => track.genre))];
  },

  getAllTempos() {
    return [...new Set(musicDatabase.map(track => track.tempo))];
  }
};

// Database Schema for Future Implementation
export const musicDatabaseSchema = {
  tracks: {
    id: 'string (primary key)',
    name: 'string',
    artist: 'string',
    mood: 'enum (happy, cinematic, energetic, emotional, professional)',
    tempo: 'enum (slow, medium, fast)',
    genre: 'enum (pop, instrumental, electronic, cinematic, rock, jazz, classical)',
    duration: 'number (seconds)',
    bpm: 'number',
    key: 'string',
    previewUrl: 'string',
    fullUrl: 'string',
    energy: 'number (0-1)',
    valence: 'number (0-1)',
    danceability: 'number (0-1)',
    tags: 'array of strings',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  
  userPreferences: {
    userId: 'string',
    favoriteMoods: 'array of strings',
    favoriteGenres: 'array of strings',
    skipReasons: 'array of objects',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  
  recommendationHistory: {
    id: 'string (primary key)',
    userId: 'string',
    videoId: 'string',
    trackId: 'string',
    analysis: 'object',
    reasoning: 'string',
    userAccepted: 'boolean',
    feedback: 'string',
    createdAt: 'timestamp'
  }
};
