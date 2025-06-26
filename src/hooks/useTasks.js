import { useState, useEffect } from 'react';
import { taskService } from '@/services/api/taskService';
import { toast } from 'react-toastify';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      let fetchedTasks;
      
      if (filters.projectId) {
        fetchedTasks = await taskService.getByProject(filters.projectId);
      } else if (filters.overdue) {
        fetchedTasks = await taskService.getOverdue();
      } else if (filters.today) {
        fetchedTasks = await taskService.getToday();
      } else {
        fetchedTasks = await taskService.getAll();
      }
      
      // Apply additional filters
      if (filters.completed !== undefined) {
        fetchedTasks = fetchedTasks.filter(task => task.completed === filters.completed);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        fetchedTasks = fetchedTasks.filter(task => 
          task.title.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by priority and creation date
      fetchedTasks.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully!');
      return newTask;
    } catch (err) {
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      
      if (updates.completed !== undefined) {
        toast.success(
          updates.completed ? 'Task completed! 🎉' : 'Task reopened'
        );
      } else {
        toast.success('Task updated successfully');
      }
      
      return updatedTask;
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const reorderTasks = async (taskIds) => {
    try {
      await taskService.reorderTasks(taskIds);
      // Reload tasks to get updated priorities
      await loadTasks();
    } catch (err) {
      toast.error('Failed to reorder tasks');
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters.projectId, filters.overdue, filters.today, filters.completed, filters.search]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    refetch: loadTasks
  };
};