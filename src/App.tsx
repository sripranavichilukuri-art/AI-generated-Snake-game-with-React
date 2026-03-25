import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Database, Wifi } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-pixel selection:bg-neon-pink selection:text-black">
      {/* CRT & Glitch Overlays */}
      <div className="crt-overlay" />
      <div className="scanline" />
      
      {/* Background Noise Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="z-10 w-full max-w-6xl flex flex-col items-center gap-12"
      >
        {/* Header Section */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between border-b-4 border-neon-blue pb-6 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-neon-pink glitch-text tracking-tighter"
              data-text="NEON_VOID_OS"
            >
              NEON_VOID_OS
            </motion.h1>
            <div className="flex items-center gap-4 text-xl text-neon-blue/60 tracking-[0.4em] mt-2">
              <span className="animate-pulse">V.2.4.0_STABLE</span>
              <span className="w-2 h-2 bg-neon-pink animate-ping rounded-full" />
              <span>ENCRYPTED_LINK</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 text-neon-blue/40">
            <div className="flex flex-col items-center gap-1">
              <Cpu className="w-8 h-8" />
              <span className="text-xs">CPU_LOAD: 88%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Database className="w-8 h-8" />
              <span className="text-xs">MEM_SYNC: OK</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wifi className="w-8 h-8" />
              <span className="text-xs">UPLINK: ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Main Interface Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-start">
          {/* Game Module */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-neon-blue mb-2">
              <div className="w-3 h-3 bg-neon-blue" />
              <h2 className="text-2xl tracking-[0.2em]">ARCADE_SUBSYSTEM_01</h2>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 border-2 border-neon-blue/20 pointer-events-none" />
              <SnakeGame />
            </div>
          </section>

          {/* Audio & Status Module */}
          <section className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-neon-pink mb-2">
                <div className="w-3 h-3 bg-neon-pink" />
                <h2 className="text-2xl tracking-[0.2em]">AUDIO_DECODER_02</h2>
              </div>
              <MusicPlayer />
            </div>

            {/* System Status Log */}
            <div className="border-4 border-neon-blue/30 bg-black/60 p-6 space-y-3">
              <div className="text-neon-blue text-lg border-b border-neon-blue/20 pb-2 mb-4">SYSTEM_LOG_OUTPUT:</div>
              <div className="space-y-1 text-sm font-mono text-neon-blue/60">
                <p className="flex gap-4"><span>[10:27:35]</span> <span className="text-neon-pink">INITIALIZING_NEURAL_NET...</span></p>
                <p className="flex gap-4"><span>[10:27:36]</span> <span>MAPPING_VIRTUAL_SPACE...</span></p>
                <p className="flex gap-4"><span>[10:27:38]</span> <span className="text-neon-green">SYNC_COMPLETE_100%</span></p>
                <p className="flex gap-4"><span>[10:27:40]</span> <span className="text-neon-pink animate-pulse">WARNING: UNKNOWN_SIGNAL_DETECTED</span></p>
                <p className="flex gap-4"><span>[10:27:42]</span> <span>WAITING_FOR_USER_INPUT...</span></p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Terminal */}
        <footer className="w-full border-t-4 border-neon-blue pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-neon-blue/30 text-sm tracking-[0.5em]">
          <div>TERMINAL_ID: 0x763404332468</div>
          <div className="flex gap-8">
            <span className="hover:text-neon-pink cursor-help transition-colors">SECURITY_PROTOCOL</span>
            <span className="hover:text-neon-pink cursor-help transition-colors">DATA_PRIVACY</span>
          </div>
          <div className="animate-pulse">SYSTEM_TIME: {new Date().toLocaleTimeString()}</div>
        </footer>
      </motion.div>
    </div>
  );
}
