import taskData from '@/services/mockData/tasks.json';

let tasks = [...taskData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(250);
    const maxId = Math.max(...tasks.map(t => parseInt(t.id)), 0);
    const newTask = {
      id: (maxId + 1).toString(),
      title: taskData.title,
      completed: false,
      projectId: taskData.projectId || null,
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 3,
      createdAt: new Date().toISOString(),
      completedAt: null,
      ...taskData
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      completedAt: updates.completed && !tasks[index].completed 
        ? new Date().toISOString() 
        : (!updates.completed && tasks[index].completed ? null : tasks[index].completedAt)
    };
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    const deletedTask = tasks.splice(index, 1)[0];
    return { ...deletedTask };
  },

  async getByProject(projectId) {
    await delay(250);
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  },

  async getOverdue() {
    await delay(200);
    const now = new Date();
    return tasks.filter(t => 
      !t.completed && 
      t.dueDate && 
      new Date(t.dueDate) < now
    ).map(t => ({ ...t }));
  },

  async getToday() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) >= today && 
      new Date(t.dueDate) < tomorrow
    ).map(t => ({ ...t }));
  },

  async bulkUpdate(taskIds, updates) {
    await delay(300);
    const updatedTasks = [];
    
    for (const id of taskIds) {
      const index = tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        const updatedTask = {
          ...tasks[index],
          ...updates,
          completedAt: updates.completed && !tasks[index].completed 
            ? new Date().toISOString() 
            : (!updates.completed && tasks[index].completed ? null : tasks[index].completedAt)
        };
        tasks[index] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  },

  async reorderTasks(taskIds) {
    await delay(200);
    const reorderedTasks = [];
    
    taskIds.forEach((id, index) => {
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        tasks[taskIndex].priority = index + 1;
        reorderedTasks.push({ ...tasks[taskIndex] });
      }
    });
    
    return reorderedTasks;
  }
};