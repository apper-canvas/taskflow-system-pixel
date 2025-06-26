import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import ProjectSidebar from '@/components/organisms/ProjectSidebar';
import TaskQuickAdd from '@/components/molecules/TaskQuickAdd';
import FilterBar from '@/components/molecules/FilterBar';
import TaskList from '@/components/organisms/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { getTaskStats } from '@/utils/taskHelpers';
import { isOverdue, isDueToday } from '@/utils/dateHelpers';

const TaskManagement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  // Combine filters for task hook
  const taskFilters = useMemo(() => ({
    ...filters,
    projectId: selectedProjectId,
    search: searchQuery
  }), [filters, selectedProjectId, searchQuery]);
  
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask, 
    deleteTask,
    refetch: refetchTasks
  } = useTasks(taskFilters);
  
  const { 
    projects, 
    loading: projectsLoading, 
    createProject,
    refetch: refetchProjects
  } = useProjects();
  
  // Calculate task statistics
  const taskStats = useMemo(() => {
    // Get all tasks without filters for accurate stats
    const allTasksStats = getTaskStats(tasks);
    
    // Add specific counts
    const todayTasks = tasks.filter(task => 
      !task.completed && isDueToday(task.dueDate)
    ).length;
    
    const overdueTasks = tasks.filter(task => 
      !task.completed && isOverdue(task.dueDate)
    ).length;
    
    return {
      ...allTasksStats,
      today: todayTasks,
      overdue: overdueTasks
    };
  }, [tasks]);
  
  // Handle task creation
  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    // Refresh projects to update task counts
    refetchProjects();
  };
  
  // Handle task updates
  const handleUpdateTask = async (taskId, updates) => {
    await updateTask(taskId, updates);
    // Refresh projects to update task counts
    refetchProjects();
  };
  
  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    // Refresh projects to update task counts
    refetchProjects();
  };
  
  // Handle project creation
  const handleCreateProject = async (projectData) => {
    await createProject(projectData);
  };
  
  // Handle search
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  
  const handleSearchClear = () => {
    setSearchQuery('');
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Handle project selection
  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    // Clear other filters when selecting a project
    setFilters({});
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        taskStats={taskStats}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <ProjectSidebar
          projects={projects}
          loading={projectsLoading}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
          onCreateProject={handleCreateProject}
        />
        
        {/* Main Content */}
        <motion.main
          className="flex-1 p-6 lg:ml-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quick Add */}
            <TaskQuickAdd
              onAdd={handleCreateTask}
              projects={projects}
              selectedProjectId={selectedProjectId}
            />
            
            {/* Filters */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              taskCounts={taskStats}
            />
            
            {/* Task List */}
            <TaskList
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              onRetry={refetchTasks}
              projects={projects}
              emptyMessage={
                selectedProjectId 
                  ? "No tasks in this project" 
                  : filters.completed === true 
                    ? "No completed tasks"
                    : filters.completed === false
                      ? "No pending tasks"
                      : filters.today
                        ? "No tasks due today"
                        : filters.overdue
                          ? "No overdue tasks"
                          : searchQuery
                            ? "No tasks match your search"
                            : "No tasks found"
              }
              emptyDescription={
                selectedProjectId
                  ? "Create your first task for this project!"
                  : filters.completed === true
                    ? "Complete some tasks to see them here!"
                    : filters.completed === false
                      ? "All caught up! No pending tasks."
                      : filters.today
                        ? "Nothing due today. Great job staying ahead!"
                        : filters.overdue
                          ? "Excellent! No overdue tasks."
                          : searchQuery
                            ? "Try a different search term or check your spelling."
                            : "Create your first task to get started!"
              }
            />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default TaskManagement;