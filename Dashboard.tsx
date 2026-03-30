import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Shield, Target, Zap } from 'lucide-react';
import { auth, getUserProfile } from '../firebase';

const Dashboard: React.FC = () => {
  const [survivorStats, setSurvivorStats] = useState([
    { name: 'Study Hours', value: '0h', icon: Zap, color: 'text-terminal-green' },
    { name: 'Current Streak', value: '0 Days', icon: Activity, color: 'text-terminal-amber' },
    { name: 'Tasks Completed', value: '0', icon: Target, color: 'text-terminal-green' },
    { name: 'Survival Rank', value: 'Rookie', icon: Shield, color: 'text-terminal-red' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid);
        if (profile) {
          setSurvivorStats([
            { name: 'Study Hours', value: `${profile.hoursStudied || 0}h`, icon: Zap, color: 'text-terminal-green' },
            { name: 'Current Streak', value: `${profile.streak || 0} Days`, icon: Activity, color: 'text-terminal-amber' },
            { name: 'Tasks Completed', value: `${profile.tasksCompleted || 0}`, icon: Target, color: 'text-terminal-green' },
            { name: 'Survival Rank', value: profile.rank || 'Rookie', icon: Shield, color: 'text-terminal-red' },
          ]);
        }
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h2 className="text-4xl font-bold glitch-text" data-text="Survivor Status">Survivor Status</h2>
        <p className="text-terminal-green/60 text-sm">Welcome back, Operator. The mission continues.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {survivorStats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="terminal-border p-6 bg-terminal-bg/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-xs text-terminal-green/40 uppercase">Stat {index + 1}</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-terminal-green/60 uppercase tracking-widest">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 terminal-border p-8 bg-terminal-bg/50 space-y-6">
          <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">Current Objectives</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-terminal-border hover:border-terminal-green transition-all duration-200">
                <div className="w-4 h-4 border border-terminal-green" />
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase">Mission Objective {i}</p>
                  <p className="text-xs text-terminal-green/60">Subject: Advanced Survival Tactics</p>
                </div>
                <span className="text-xs text-terminal-amber uppercase">In Progress</span>
              </div>
            ))}
          </div>
        </section>

        <section className="terminal-border p-8 bg-terminal-bg/50 space-y-6">
          <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">Intel Feed</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 text-xs">
                <span className="text-terminal-green/40">09:4{i}</span>
                <p className="text-terminal-green/80">User_Survivor_{i} has joined the study room.</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
