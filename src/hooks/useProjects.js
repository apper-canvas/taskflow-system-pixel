import { useState, useEffect } from 'react';
import { projectService } from '@/services/api/projectService';
import { toast } from 'react-toastify';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedProjects = await projectService.getAll();
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      toast.success('Project created successfully!');
      return newProject;
    } catch (err) {
      toast.error('Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const updatedProject = await projectService.update(id, updates);
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ));
      toast.success('Project updated successfully');
      return updatedProject;
    } catch (err) {
      toast.error('Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
      throw err;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: loadProjects
  };
};