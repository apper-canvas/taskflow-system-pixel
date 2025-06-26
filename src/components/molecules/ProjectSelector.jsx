import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ProjectSelector = ({ 
  projects = [], 
  selectedProjectId, 
  onSelect, 
  showAllOption = true,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  const handleSelect = (projectId) => {
    onSelect(projectId);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          {selectedProject ? (
            <>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedProject.color }}
              />
              <span className="text-gray-900 font-medium">{selectedProject.name}</span>
              <span className="text-gray-500 text-sm">({selectedProject.taskCount})</span>
            </>
          ) : (
            <>
              <ApperIcon name="Folder" size={16} className="text-gray-400" />
              <span className="text-gray-500">Select Project</span>
            </>
          )}
        </div>
        
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
          >
            {showAllOption && (
              <motion.button
                type="button"
                onClick={() => handleSelect(null)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                  !selectedProjectId ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
                whileHover={{ backgroundColor: '#F9FAFB' }}
              >
                <ApperIcon name="FolderOpen" size={16} className="text-gray-400" />
                <span className="font-medium">All Projects</span>
              </motion.button>
            )}
            
            {projects.map(project => (
              <motion.button
                key={project.id}
                type="button"
                onClick={() => handleSelect(project.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                  selectedProjectId === project.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
                whileHover={{ backgroundColor: '#F9FAFB' }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="font-medium">{project.name}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {project.taskCount}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSelector;