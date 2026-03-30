/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, getUserProfile, updateUserProfile } from './firebase';
import Layout from './components/ui/Layout';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import BuddyMatching from './components/BuddyMatching';
import StudyRoom from './components/StudyRoom';
import Profile from './components/Profile';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if profile exists, if not create it
        const profile = await getUserProfile(user.uid);
        if (!profile) {
          await updateUserProfile(user.uid, {
            uid: user.uid,
            name: user.displayName || 'Survivor',
            email: user.email,
            level: 1,
            xp: 0,
            rank: 'Rookie',
            streak: 0,
            hoursStudied: 0,
            tasksCompleted: 0
          });
        }
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="crt-overlay" />
        <div className="scanline" />
        <div className="text-2xl font-bold glitch-text animate-pulse" data-text="LOADING SYSTEM...">LOADING SYSTEM...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/buddy" element={<BuddyMatching />} />
          <Route path="/room" element={<StudyRoom />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
