import projectData from '@/services/mockData/projects.json';
import { taskService } from '@/services/api/taskService';

let projects = [...projectData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay(250);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(300);
    const maxId = Math.max(...projects.map(p => parseInt(p.id)), 0);
    const newProject = {
      id: (maxId + 1).toString(),
      name: projectData.name,
      color: projectData.color || '#5B21B6',
      taskCount: 0,
      createdAt: new Date().toISOString(),
      ...projectData
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updates) {
    await delay(200);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...projects[index],
      ...updates
    };
    
    projects[index] = updatedProject;
    return { ...updatedProject };
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    const deletedProject = projects.splice(index, 1)[0];
    return { ...deletedProject };
  },

  async updateTaskCount(projectId, count) {
    await delay(150);
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index].taskCount = count;
      return { ...projects[index] };
    }
    return null;
  },

  async getProjectsWithTaskCounts() {
    await delay(300);
    const projectsWithCounts = [];
    
    for (const project of projects) {
      try {
        const projectTasks = await taskService.getByProject(project.id);
        const activeTasks = projectTasks.filter(t => !t.completed);
        projectsWithCounts.push({
          ...project,
          taskCount: activeTasks.length
        });
      } catch (error) {
        projectsWithCounts.push({
          ...project,
          taskCount: 0
        });
      }
    }
    
    return projectsWithCounts;
  }
};