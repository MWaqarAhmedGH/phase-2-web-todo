"use client";

/**
 * Dashboard with stunning 3D visuals
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getTasks, createTask, updateTask, toggleTask, deleteTask, Task, ApiError } from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";
import TaskList from "@/components/TaskList";
import TaskForm, { TaskFormData } from "@/components/TaskForm";

type PageState = "loading" | "authenticated" | "unauthenticated";

export default function DashboardPage() {
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("Dashboard: Checking session...");
        const session = await authClient.getSession();
        console.log("Dashboard: Session response:", JSON.stringify(session, null, 2));

        if (session.error) {
          console.error("Dashboard: Session error (full):", JSON.stringify(session.error, null, 2));
          // Try to fetch the error details directly
          try {
            const errorRes = await fetch('/api/auth/get-session');
            const errorBody = await errorRes.text();
            console.error("Dashboard: Raw error response:", errorBody);
          } catch (e) {
            console.error("Dashboard: Could not fetch error details:", e);
          }
          setAuthError(`Session error: ${session.error.message || JSON.stringify(session.error)}`);
          setPageState("unauthenticated");
          setTimeout(() => window.location.href = "/signin", 5000);
          return;
        }

        if (!session.data?.user) {
          console.error("Dashboard: No user in session data");
          setAuthError("No session found. Please sign in.");
          setPageState("unauthenticated");
          setTimeout(() => window.location.href = "/signin", 3000);
          return;
        }

        console.log("Dashboard: User authenticated:", session.data.user.email);
        setUserId(session.data.user.id);
        setUserName(session.data.user.name || session.data.user.email?.split('@')[0] || 'User');
        setPageState("authenticated");
      } catch (err) {
        console.error("Dashboard: Auth check failed:", err);
        setAuthError(err instanceof Error ? err.message : "Authentication failed");
        setPageState("unauthenticated");
        setTimeout(() => window.location.href = "/signin", 3000);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    async function fetchTasks() {
      if (!userId) return;
      setTasksLoading(true);
      setTasksError(null);

      try {
        const data = await getTasks(userId);
        setTasks(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setTasksError(err.message);
        } else {
          setTasksError("Failed to load tasks.");
        }
      } finally {
        setTasksLoading(false);
      }
    }

    if (pageState === "authenticated" && userId) {
      fetchTasks();
    }
  }, [pageState, userId]);

  async function handleToggle(taskId: number) {
    if (!userId) return;
    try {
      const updatedTask = await toggleTask(userId, taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  }

  async function handleDelete(taskId: number) {
    if (!userId) return;
    try {
      await deleteTask(userId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  async function handleCreate(data: TaskFormData) {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const newTask = await createTask(userId, data);
      setTasks((prev) => [newTask, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: TaskFormData) {
    if (!userId || !editingTask) return;
    setIsSubmitting(true);
    try {
      const updatedTask = await updateTask(userId, editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      setEditingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(taskId: number) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  // Stats
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-3d mx-auto mb-4"></div>
          <p className="text-white/60 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (pageState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center px-4">
        <div className="card-3d p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          {authError && <p className="text-red-400 mb-4 text-sm">{authError}</p>}
          <p className="text-white/60">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic relative">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 top-20 left-10 opacity-30"></div>
        <div className="orb orb-2 bottom-40 right-20 opacity-25"></div>
        <div className="orb orb-3 top-1/2 right-1/3 opacity-20"></div>
      </div>

      {/* Particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="particle fixed"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            opacity: Math.random() * 0.2 + 0.1,
          }}
        />
      ))}

      {/* Header */}
      <header className="relative z-50 border-b border-white/10" style={{ background: 'rgba(15, 15, 35, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gradient-vivid">Evolution of Todo</h1>
            </div>

            {/* User & Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)' }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/80 font-medium">Hi, {userName}!</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Tasks", value: tasks.length, icon: "📋", gradient: "from-indigo-500 to-purple-500", glow: "rgba(99, 102, 241, 0.4)" },
            { label: "Completed", value: completedTasks, icon: "✅", gradient: "from-emerald-400 to-cyan-500", glow: "rgba(16, 185, 129, 0.4)" },
            { label: "Progress", value: `${completionRate}%`, icon: "🎯", gradient: "from-pink-500 to-orange-500", glow: "rgba(236, 72, 153, 0.4)" },
          ].map((stat, i) => (
            <div
              key={i}
              className="card-3d p-6 opacity-0 animate-fade-in-up-3d"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-2xl`}
                  style={{ boxShadow: `0 0 30px ${stat.glow}` }}
                >
                  {stat.icon}
                </div>
              </div>
              {stat.label === "Progress" && (
                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${completionRate}%`,
                      background: 'linear-gradient(90deg, #ec4899, #f97316)',
                      boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 opacity-0 animate-fade-in-up-3d stagger-2" style={{ animationFillMode: 'forwards' }}>
            {editingTask ? (
              <TaskForm
                initialTask={editingTask}
                onSubmit={handleUpdate}
                onCancel={handleCancelEdit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <TaskForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
            )}
          </div>

          {/* Task List */}
          <div className="lg:col-span-2 opacity-0 animate-fade-in-up-3d stagger-3" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
              {pendingTasks > 0 && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.2), rgba(255, 0, 110, 0.2))',
                    border: '1px solid rgba(255, 149, 0, 0.3)',
                    color: '#ffb347'
                  }}>
                  {pendingTasks} pending
                </span>
              )}
            </div>

            {tasksLoading && (
              <div className="text-center py-16">
                <div className="dots-loading justify-center mb-4">
                  <span></span><span></span><span></span>
                </div>
                <p className="text-white/50">Loading tasks...</p>
              </div>
            )}

            {tasksError && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 mb-6">
                <p className="text-red-300">{tasksError}</p>
              </div>
            )}

            {!tasksLoading && !tasksError && (
              <TaskList
                tasks={tasks}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
