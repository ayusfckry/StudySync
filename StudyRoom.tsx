import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Music } from 'lucide-react';
import { cn } from '../lib/utils';
import { addSession, auth, getUserProfile, updateUserProfile } from '../firebase';

const StudyRoom: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const sessionStartTime = useRef<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      if (!sessionStartTime.current) {
        sessionStartTime.current = new Date().toISOString();
      }
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    const endTime = new Date().toISOString();
    const duration = mode === 'work' ? 25 * 60 : 5 * 60;
    
    if (auth.currentUser && sessionStartTime.current) {
      await addSession({
        startTime: sessionStartTime.current,
        endTime,
        duration,
        mode
      });

      if (mode === 'work') {
        const profile = await getUserProfile(auth.currentUser.uid);
        if (profile) {
          await updateUserProfile(auth.currentUser.uid, {
            hoursStudied: (profile.hoursStudied || 0) + (duration / 3600),
            xp: (profile.xp || 0) + 10
          });
        }
      }
    }
    
    sessionStartTime.current = null;
    if (mode === 'work') {
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h2 className="text-4xl font-bold glitch-text" data-text="Safe Zone">Safe Zone</h2>
        <p className="text-terminal-green/60 text-sm">Focus. The perimeter is secure for now.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Timer Display */}
        <section className="terminal-border p-12 bg-terminal-bg/50 flex flex-col items-center justify-center space-y-10">
          <div className="flex gap-4">
            <button
              onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
              className={cn(
                "px-4 py-1 border text-xs uppercase transition-all duration-200",
                mode === 'work' ? "bg-terminal-green text-terminal-bg border-terminal-green" : "border-terminal-border hover:border-terminal-green"
              )}
            >
              Focus Mode
            </button>
            <button
              onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
              className={cn(
                "px-4 py-1 border text-xs uppercase transition-all duration-200",
                mode === 'break' ? "bg-terminal-green text-terminal-bg border-terminal-green" : "border-terminal-border hover:border-terminal-green"
              )}
            >
              Break Mode
            </button>
          </div>

          <motion.div
            key={timeLeft}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl font-bold tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.div>

          <div className="flex gap-6">
            <button
              onClick={toggleTimer}
              className="w-16 h-16 rounded-full border border-terminal-green flex items-center justify-center hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200"
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-16 h-16 rounded-full border border-terminal-border flex items-center justify-center hover:border-terminal-green transition-all duration-200"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
          </div>
        </section>

        {/* Atmosphere Controls */}
        <section className="space-y-8">
          <div className="terminal-border p-8 bg-terminal-bg/50 space-y-6">
            <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">Atmosphere</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">Dark Synthwave</span>
                </div>
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-5 h-5 text-terminal-red" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
              <div className="h-1 bg-terminal-border relative">
                <div className="absolute top-0 left-0 h-full bg-terminal-green w-2/3" />
              </div>
            </div>
          </div>

          <div className="terminal-border p-8 bg-terminal-bg/50 space-y-6">
            <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">Active Survivors</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                  <span className="text-sm uppercase tracking-widest">Operator_{i}</span>
                  <span className="text-xs text-terminal-green/40 ml-auto">Focusing...</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudyRoom;
