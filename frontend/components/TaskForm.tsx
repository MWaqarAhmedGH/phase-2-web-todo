"use client";

/**
 * TaskForm with 3D effects
 */

import { useState, useEffect } from "react";
import { Task } from "@/lib/api";

export interface TaskFormData {
  title: string;
  description: string;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  initialTask?: Task;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({
  onSubmit,
  initialTask,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!initialTask;

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialTask]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Title must be 200 characters or less");
      return;
    }

    if (description.length > 1000) {
      setError("Description must be 1000 characters or less");
      return;
    }

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
      });

      if (!isEditMode) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    }
  }

  return (
    <div className="card-3d overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{
          background: isEditMode
            ? 'linear-gradient(135deg, #ff9500 0%, #ff006e 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          boxShadow: isEditMode
            ? 'inset 0 -2px 10px rgba(0, 0, 0, 0.2)'
            : 'inset 0 -2px 10px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {isEditMode ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-white/70 text-sm">
              {isEditMode ? "Update your task details" : "What do you need to accomplish?"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 animate-scale-in-3d">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            Task Title <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={200}
              required
              disabled={isSubmitting}
              className="input-3d disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-white/40">Be specific and actionable</span>
            <span className={title.length > 180 ? 'text-orange-400' : 'text-white/40'}>{title.length}/200</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            Description <span className="text-white/40 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details, steps, or notes..."
            maxLength={1000}
            rows={4}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/40 resize-none transition-all focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }}
          />
          <div className="mt-2 text-right">
            <span className={`text-xs ${description.length > 900 ? 'text-orange-400' : 'text-white/40'}`}>
              {description.length}/1000
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {isEditMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-white/70 border-2 border-white/20 hover:border-white/40 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 btn-3d disabled:opacity-50 disabled:cursor-not-allowed ${
              isEditMode ? '' : ''
            }`}
            style={isEditMode ? {
              background: 'linear-gradient(135deg, #ff9500 0%, #ff006e 100%)',
              boxShadow: '0 10px 20px -10px rgba(255, 149, 0, 0.5), 0 6px 0 0 #cc7700'
            } : {}}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? "Saving..." : "Adding..."}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {isEditMode ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Task
                  </>
                )}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
