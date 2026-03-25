import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/300/300',
  },
  {
    id: '2',
    title: 'Cyber City',
    artist: 'Digital Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/300/300',
  },
  {
    id: '3',
    title: 'Midnight Pulse',
    artist: 'Retro Future',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/300/300',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full bg-black border-2 border-[#ff00ff] p-6 shadow-[0_0_30px_rgba(255,0,255,0.2)] relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={isPlaying ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="relative w-24 h-24 border-4 border-[#00ffff] shadow-[0_0_15px_#00ffff]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex-1 overflow-hidden">
            <h3 className="text-[#00ffff] font-black text-2xl truncate glitch" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <p className="text-[#ff00ff] text-xs truncate uppercase tracking-[0.3em] mt-1">
              ID: {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#00ffff]/10 h-4 border border-[#00ffff]/30 relative overflow-hidden">
          <motion.div 
            className="bg-[#ff00ff] h-full shadow-[0_0_15px_#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold tracking-widest mix-blend-difference">
            LOADING_BUFFER... {Math.round(progress)}%
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={prevTrack}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2 border-2 border-transparent hover:border-[#ff00ff]"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-20 h-20 bg-black border-4 border-[#ff00ff] flex items-center justify-center text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all transform hover:scale-110 shadow-[0_0_20px_#ff00ff]"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2 border-2 border-transparent hover:border-[#ff00ff]"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>
      </div>

      {/* Visualizer Mock */}
      <div className="mt-6 flex items-end justify-between h-8 gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={isPlaying ? { height: [4, Math.random() * 32, 4] } : { height: 4 }}
            transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.05 }}
            className="flex-1 bg-[#00ffff]/40"
          />
        ))}
      </div>
    </div>
  );
};
