import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Radio, Volume2, VolumeX, Activity } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "NEON_DREAMS_V1",
    artist: "CORE_SYNTH",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "CYBER_PULSE_X",
    artist: "NEURAL_LINK",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "DIGITAL_HORIZON_0",
    artist: "VIRTUAL_OS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.error("SIGNAL_FAILURE:", e);
            setIsPlaying(false);
          });
      }
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play()
          .catch(e => {
            console.error("SIGNAL_FAILURE_ON_SYNC:", e);
            setIsPlaying(false);
          });
      }
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="flex flex-col w-full max-w-md p-8 bg-black border-4 border-neon-pink shadow-[0_0_20px_#ff00ff] relative font-pixel">
      <div className="absolute top-0 right-0 w-2 h-full bg-neon-pink/20 animate-pulse" />
      
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        muted={isMuted}
      />

      <div className="flex items-center gap-8 mb-8">
        <motion.div
          key={currentTrackIndex}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-32 h-32 border-4 border-neon-blue shadow-[0_0_15px_#00ffff] overflow-hidden group"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150 group-hover:grayscale-0 transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-neon-pink/20 mix-blend-overlay" />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Activity className="w-12 h-12 text-neon-pink animate-pulse" />
            </div>
          )}
        </motion.div>

        <div className="flex-1 overflow-hidden space-y-2">
          <div className="text-xs text-neon-blue/60 tracking-[0.3em]">SIGNAL_SOURCE:</div>
          <h3 className="text-3xl font-bold text-neon-pink truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <div className="text-xs text-neon-blue/60 tracking-[0.3em]">ORIGIN:</div>
          <p className="text-xl text-neon-blue truncate tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-8">
        <div className="flex justify-between text-xs text-neon-blue/40 tracking-widest">
          <span>SYNC_RATIO</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="w-full h-4 bg-black border-2 border-neon-blue p-0.5 overflow-hidden">
          <motion.div
            className="h-full bg-neon-blue shadow-[0_0_10px_#00ffff]"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 border-2 transition-all ${isMuted ? 'border-neon-pink text-neon-pink' : 'border-neon-blue/40 text-neon-blue/40 hover:border-neon-blue hover:text-neon-blue'}`}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={skipBack}
            className="p-3 border-2 border-neon-pink/40 text-neon-pink/40 hover:border-neon-pink hover:text-neon-pink transition-all active:scale-90"
          >
            <SkipBack className="w-8 h-8" />
          </button>

          <button
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-neon-pink text-black border-4 border-neon-pink hover:bg-black hover:text-neon-pink transition-all shadow-[0_0_20px_#ff00ff] active:scale-95"
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
          </button>

          <button
            onClick={skipForward}
            className="p-3 border-2 border-neon-pink/40 text-neon-pink/40 hover:border-neon-pink hover:text-neon-pink transition-all active:scale-90"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        <div className="p-3 border-2 border-neon-blue/40 text-neon-blue/40">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
