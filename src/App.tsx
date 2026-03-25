import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-mono selection:bg-[#ff00ff]/50 overflow-x-hidden relative">
      {/* Visual Artifacts */}
      <div className="noise" />
      <div className="scanlines" />
      
      <header className="relative z-10 pt-12 pb-8 text-center border-b-2 border-[#ff00ff]/30">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block"
        >
          <h1 
            className="text-6xl md:text-8xl font-black uppercase glitch tracking-widest"
            data-text="SYSTEM_FAILURE"
          >
            SYSTEM_FAILURE
          </h1>
          <div className="mt-4 flex justify-center gap-4 text-xs tracking-[1em] text-[#ff00ff] animate-pulse">
            <span>[ PROTOCOL_001 ]</span>
            <span>[ DATA_CORRUPT ]</span>
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-16 py-16">
        
        <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-12 max-w-6xl">
          {/* Game Section */}
          <motion.section 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 w-full border-2 border-[#00ffff] p-8 bg-black/40 backdrop-blur-sm relative overflow-hidden tear"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-bounce" />
            <div className="mb-8 flex justify-between items-center">
              <span className="text-sm bg-[#00ffff] text-black px-2 py-1 font-bold">MODULE: SNAKE_CORE</span>
              <span className="text-[10px] text-[#ff00ff]">STATUS: UNSTABLE</span>
            </div>
            <SnakeGame />
          </motion.section>

          {/* Music Section */}
          <motion.section 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full lg:w-96 border-2 border-[#ff00ff] p-8 bg-black/40 backdrop-blur-sm relative tear"
            style={{ animationDelay: '1s' }}
          >
            <div className="absolute bottom-0 right-0 w-1 h-full bg-[#00ffff] animate-pulse" />
            <div className="mb-8 flex justify-between items-center">
              <span className="text-sm bg-[#ff00ff] text-black px-2 py-1 font-bold">AUDIO_LINK</span>
              <span className="text-[10px] text-[#00ffff]">FREQ: 44.1KHZ</span>
            </div>
            <MusicPlayer />
            
            <div className="mt-12 space-y-4">
              <div className="h-px bg-[#00ffff]/20 w-full" />
              <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
                <p>INITIALIZING NEURAL INTERFACE...</p>
                <p>BYPASSING SECURITY PROTOCOLS...</p>
                <p className="text-[#ff00ff]">WARNING: REALITY_LEAK DETECTED</p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Terminal Output */}
        <div className="w-full max-w-6xl bg-black border border-[#00ffff]/20 p-4 font-mono text-[10px] text-slate-600">
          <div className="flex gap-4">
            <span className="text-[#00ffff] animate-pulse">&gt;</span>
            <span className="typing-effect">FETCHING_USER_DATA... SUCCESS. MAPPING_COORDINATES... 35.6895° N, 139.6917° E. INJECTING_STATIC...</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-12 text-center border-t-2 border-[#00ffff]/10">
        <div className="text-[10px] tracking-[1em] text-slate-700 uppercase">
          VOID_OS // NO_RECOVERY_POSSIBLE
        </div>
      </footer>
    </div>
  );
}
