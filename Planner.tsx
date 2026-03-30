import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { getTasks, addTask, updateTask, deleteTask as deleteFirestoreTask, auth } from '../firebase';

interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
}

const Planner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', subject: '', deadline: '' });

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = getTasks(auth.currentUser.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (newTask.title && newTask.subject && newTask.deadline) {
      await addTask({
        title: newTask.title,
        subject: newTask.subject,
        deadline: newTask.deadline,
        completed: false
      });
      setNewTask({ title: '', subject: '', deadline: '' });
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    await updateTask(id, { completed: !currentStatus });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteFirestoreTask(id);
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h2 className="text-4xl font-bold glitch-text" data-text="Mission Planner">Mission Planner</h2>
        <p className="text-terminal-green/60 text-sm">Organize your objectives. Survival depends on it.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Add Task Form */}
        <section className="terminal-border p-8 bg-terminal-bg/50 space-y-6 h-fit">
          <h3 className="text-xl font-bold border-b border-terminal-border pb-4 uppercase">New Objective</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-terminal-green/60 uppercase">Mission Title</label>
              <input
                type="text"
                className="terminal-input"
                placeholder="Enter title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-terminal-green/60 uppercase">Subject Area</label>
              <input
                type="text"
                className="terminal-input"
                placeholder="Enter subject..."
                value={newTask.subject}
                onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-terminal-green/60 uppercase">Deadline</label>
              <input
                type="date"
                className="terminal-input"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <button
              onClick={handleAddTask}
              className="terminal-button w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Deploy Objective
            </button>
          </div>
        </section>

        {/* Task List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-terminal-border pb-4">
            <h3 className="text-xl font-bold uppercase">Active Missions</h3>
            <span className="text-xs text-terminal-green/40 uppercase">{tasks.length} Missions Active</span>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "terminal-border p-6 bg-terminal-bg/50 flex items-center gap-6 transition-all duration-300",
                  task.completed ? "opacity-50 grayscale" : "hover:border-terminal-green"
                )}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={cn(
                    "w-6 h-6 border flex items-center justify-center transition-colors duration-200",
                    task.completed ? "bg-terminal-green border-terminal-green" : "border-terminal-green hover:bg-terminal-green/20"
                  )}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4 text-terminal-bg" />}
                </button>

                <div className="flex-1 space-y-1">
                  <h4 className={cn("text-lg font-bold uppercase", task.completed && "line-through")}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-terminal-green/60 uppercase">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.deadline}
                    </span>
                    <span>Subject: {task.subject}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-terminal-red hover:bg-terminal-red/10 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-20 border border-dashed border-terminal-border">
                <p className="text-terminal-green/40 uppercase text-sm">No active missions. Scan for objectives.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Planner;
