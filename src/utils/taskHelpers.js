export const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return '#EF4444'; // High priority - Red
    case 2:
      return '#F59E0B'; // Medium priority - Amber
    case 3:
      return '#3B82F6'; // Low priority - Blue
    default:
      return '#6B7280'; // Default - Gray
  }
};

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 1:
      return 'High';
    case 2:
      return 'Medium';
    case 3:
      return 'Low';
    default:
      return 'Normal';
  }
};

export const getPriorityBorderWidth = (priority) => {
  switch (priority) {
    case 1:
      return '4px'; // High priority - Thick border
    case 2:
      return '3px'; // Medium priority - Medium border
    case 3:
      return '2px'; // Low priority - Thin border
    default:
      return '1px'; // Default - Minimal border
  }
};

export const sortTasksByPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority (1 = high, 3 = low)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const filterTasks = (tasks, filters) => {
  let filteredTasks = [...tasks];
  
  // Filter by completion status
  if (filters.completed !== undefined) {
    filteredTasks = filteredTasks.filter(task => task.completed === filters.completed);
  }
  
  // Filter by project
  if (filters.projectId) {
    filteredTasks = filteredTasks.filter(task => task.projectId === filters.projectId);
  }
  
  // Filter by search query
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by due date
  if (filters.dueDate) {
    const filterDate = new Date(filters.dueDate);
    filteredTasks = filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === filterDate.toDateString();
    });
  }
  
  return filteredTasks;
};

export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    !isDueToday(task.dueDate)
  ).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    pending,
    overdue,
    completionRate
  };
};

const isDueToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const taskDate = new Date(date);
  return taskDate.toDateString() === today.toDateString();
};