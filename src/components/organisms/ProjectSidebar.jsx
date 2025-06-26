import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

const ProjectSidebar = ({ 
  projects = [], 
  loading = false,
  selectedProjectId, 
  onProjectSelect,
  onCreateProject,
  className = '' 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#5B21B6');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const predefinedColors = [
    '#5B21B6', '#EF4444', '#10B981', '#3B82F6', 
    '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4',
    '#84CC16', '#F97316', '#6366F1', '#14B8A6'
  ];
  
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    try {
      await onCreateProject({
        name: newProjectName.trim(),
        color: newProjectColor
      });
      
      setNewProjectName('');
      setNewProjectColor('#5B21B6');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };
  
  const handleCancel = () => {
    setNewProjectName('');
    setNewProjectColor('#5B21B6');
    setIsCreating(false);
  };
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name={isSidebarOpen ? "X" : "Menu"} size={20} />
      </motion.button>
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-out ${className}`}
        style={{ width: '280px' }}
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold gradient-text">Projects</h2>
            <Button
              variant="ghost"
              size="sm"
              icon="Plus"
              onClick={() => setIsCreating(true)}
              className="shrink-0"
            />
          </div>
          
          {/* All Tasks Option */}
          <motion.button
            onClick={() => {
              onProjectSelect(null);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-2 ${
              !selectedProjectId
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Inbox" size={18} />
              <span className="font-medium">All Tasks</span>
            </div>
            <Badge 
              variant={!selectedProjectId ? 'default' : 'primary'} 
              size="sm"
              className={!selectedProjectId ? 'bg-white/20 text-white' : ''}
            >
              {projects.reduce((total, project) => total + project.taskCount, 0)}
            </Badge>
          </motion.button>
          
          {/* Projects List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.button
                    key={project.id}
                    onClick={() => {
                      onProjectSelect(project.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      selectedProjectId === project.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-medium truncate">{project.name}</span>
                    </div>
                    <Badge 
                      variant={selectedProjectId === project.id ? 'default' : 'primary'} 
                      size="sm"
                      className={selectedProjectId === project.id ? 'bg-white/20 text-white' : ''}
                    >
                      {project.taskCount}
                    </Badge>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {/* Create Project Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <form onSubmit={handleCreateProject}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {predefinedColors.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewProjectColor(color)}
                            className={`w-8 h-8 rounded-full transition-all duration-200 ${
                              newProjectColor === color 
                                ? 'ring-2 ring-gray-400 ring-offset-2' 
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={!newProjectName.trim()}
                        className="flex-1"
                      >
                        Create
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectSidebar;