import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Zap, Activity, User, Settings, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, getUserProfile } from '../firebase';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Survivor',
    level: 1,
    xp: 0,
    rank: 'Rookie',
    hoursStudied: 0,
    tasksCompleted: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const data = await getUserProfile(auth.currentUser.uid);
        if (data) {
          setProfile({
            name: data.name || 'Survivor',
            level: data.level || 1,
            xp: data.xp || 0,
            rank: data.rank || 'Rookie',
            hoursStudied: data.hoursStudied || 0,
            tasksCompleted: data.tasksCompleted || 0
          });
        }
      }
    };
    fetchProfile();
  }, []);

  const achievements = [
    { name: 'First Blood', description: 'Complete your first study session.', icon: Award, unlocked: true },
    { name: 'Survivor', description: 'Maintain a 7-day streak.', icon: Shield, unlocked: true },
    { name: 'Elite Operator', description: 'Complete 100 hours of study.', icon: Zap, unlocked: false },
    { name: 'Mission Specialist', description: 'Complete 50 mission objectives.', icon: Target, unlocked: false },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h2 className="text-4xl font-bold glitch-text" data-text="Survivor Profile">Survivor Profile</h2>
        <p className="text-terminal-green/60 text-sm">Your identity in the wasteland.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <section className="terminal-border p-10 bg-terminal-bg/50 space-y-8 h-fit">
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 rounded-full border-2 border-terminal-green flex items-center justify-center bg-terminal-green/10">
              <User className="w-16 h-16 text-terminal-green" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-widest">{profile.name}</h3>
              <p className="text-xs text-terminal-green/60 uppercase tracking-widest">{profile.rank}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-terminal-border">
            <div className="flex items-center justify-between text-sm uppercase tracking-widest">
              <span className="text-terminal-green/40">Level:</span>
              <span className="text-terminal-green">{profile.level}</span>
            </div>
            <div className="flex items-center justify-between text-sm uppercase tracking-widest">
              <span className="text-terminal-green/40">XP:</span>
              <span className="text-terminal-green">{profile.xp}</span>
            </div>
            <div className="h-2 bg-terminal-border relative">
              <div 
                className="absolute top-0 left-0 h-full bg-terminal-green" 
                style={{ width: `${(profile.xp % 1000) / 10}%` }}
              />
            </div>
          </div>

          <button className="terminal-button w-full flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Modify Identity
          </button>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="terminal-border p-4 bg-terminal-bg/50 text-center space-y-1">
              <p className="text-[10px] text-terminal-green/60 uppercase">Hours Studied</p>
              <p className="text-xl font-bold text-terminal-green">{profile.hoursStudied.toFixed(1)}h</p>
            </div>
            <div className="terminal-border p-4 bg-terminal-bg/50 text-center space-y-1">
              <p className="text-[10px] text-terminal-green/60 uppercase">Missions Done</p>
              <p className="text-xl font-bold text-terminal-green">{profile.tasksCompleted}</p>
            </div>
          </div>
        </section>

        {/* Achievements & Stats */}
        <section className="lg:col-span-2 space-y-10">
          <div className="terminal-border p-8 bg-terminal-bg/50 space-y-6">
            <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-6 border flex items-center gap-6 transition-all duration-300",
                    achievement.unlocked ? "border-terminal-green bg-terminal-green/5" : "border-terminal-border opacity-40 grayscale"
                  )}
                >
                  <achievement.icon className={cn("w-10 h-10", achievement.unlocked ? "text-terminal-green" : "text-terminal-green/40")} />
                  <div className="space-y-1">
                    <p className="text-sm font-bold uppercase">{achievement.name}</p>
                    <p className="text-xs text-terminal-green/60">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="terminal-border p-8 bg-terminal-bg/50 space-y-6">
            <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">Mission History</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-terminal-border">
                  <Activity className="w-5 h-5 text-terminal-green/40" />
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase">Mission Objective {i} Completed</p>
                    <p className="text-xs text-terminal-green/60">Date: 2026-03-2{i}</p>
                  </div>
                  <span className="text-xs text-terminal-green uppercase">+500 XP</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
