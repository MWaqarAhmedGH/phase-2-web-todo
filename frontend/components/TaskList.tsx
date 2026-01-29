"use client";

/**
 * TaskList with 3D effects
 */

import { Task } from "@/lib/api";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="card-3d p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)'
          }}>
          <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No tasks yet</h3>
        <p className="text-white/50 max-w-sm mx-auto mb-6">
          Create your first task and start being productive!
        </p>
        <div className="dots-loading justify-center">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="group card-3d overflow-hidden opacity-0 animate-slide-in-3d"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'forwards'
          }}
        >
          {/* Status bar */}
          <div
            className="h-1.5"
            style={{
              background: task.completed
                ? 'linear-gradient(90deg, #10b981, #06b6d4, #00ff88)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef, #ec4899)',
              boxShadow: task.completed
                ? '0 0 15px rgba(16, 185, 129, 0.5)'
                : '0 0 15px rgba(139, 92, 246, 0.5)'
            }}
          />

          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => onToggle(task.id)}
                className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 ${
                  task.completed
                    ? ''
                    : 'border-2 border-white/30 hover:border-purple-400'
                }`}
                style={task.completed ? {
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                } : {}}
                title={task.completed ? "Mark as pending" : "Mark as complete"}
              >
                {task.completed && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className={`text-lg font-semibold leading-tight ${
                    task.completed ? "text-white/40 line-through" : "text-white"
                  }`}>
                    {task.title}
                  </h3>

                  {/* Status badge */}
                  <span
                    className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={task.completed ? {
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399'
                    } : {
                      background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.2), rgba(255, 0, 110, 0.2))',
                      border: '1px solid rgba(255, 149, 0, 0.3)',
                      color: '#ffb347'
                    }}
                  >
                    {task.completed ? (
                      <>
                        <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Done
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending
                      </>
                    )}
                  </span>
                </div>

                {/* Description */}
                {task.description && (
                  <p className={`text-sm leading-relaxed mb-3 ${
                    task.completed ? "text-white/30" : "text-white/60"
                  }`}>
                    {task.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center text-xs text-white/40">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(task.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      className={`p-2 rounded-lg transition-all ${
                        task.completed
                          ? "text-amber-400 hover:bg-amber-400/20"
                          : "text-emerald-400 hover:bg-emerald-400/20"
                      }`}
                      title={task.completed ? "Mark as pending" : "Mark as complete"}
                    >
                      {task.completed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Edit */}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(task.id)}
                        className="p-2 text-purple-400 hover:bg-purple-400/20 rounded-lg transition-all"
                        title="Edit task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all"
                      title="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
