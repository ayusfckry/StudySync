import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, UserPlus, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAllUsers, auth } from '../firebase';

interface Buddy {
  id: string;
  name: string;
  rank: string;
  subject?: string;
  online?: boolean;
}

const BuddyMatching: React.FC = () => {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = getAllUsers((users) => {
      // Filter out current user
      const otherUsers = users.filter(u => u.id !== auth.currentUser?.uid);
      setBuddies(otherUsers);
    });
    return () => unsubscribe();
  }, []);

  const filteredBuddies = buddies.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    (b.subject && b.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h2 className="text-4xl font-bold glitch-text" data-text="Lobby">Lobby</h2>
        <p className="text-terminal-green/60 text-sm">Find other survivors. Strength in numbers.</p>
      </header>

      <div className="max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-green/40" />
          <input
            type="text"
            className="terminal-input pl-12"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBuddies.map((buddy, index) => (
          <motion.div
            key={buddy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="terminal-border p-8 bg-terminal-bg/50 space-y-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  buddy.online ? "bg-terminal-green animate-pulse" : "bg-terminal-border"
                )} />
                <h3 className="text-xl font-bold uppercase">{buddy.name}</h3>
              </div>
              <Shield className="w-5 h-5 text-terminal-amber" />
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <span className="text-terminal-green/40">Rank:</span>
                <span className="text-terminal-green">{buddy.rank || 'Rookie'}</span>
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <span className="text-terminal-green/40">Subject:</span>
                <span className="text-terminal-green">{buddy.subject || 'Undetermined'}</span>
              </div>
            </div>

            <button className="terminal-button w-full flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Request Reinforcement
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BuddyMatching;
