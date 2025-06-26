import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { parseDateFromText } from '@/utils/dateHelpers';

const TaskQuickAdd = ({ onAdd, projects = [], selectedProjectId = null, className = '' }) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(selectedProjectId);
  const [priority, setPriority] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    setSelectedProject(selectedProjectId);
  }, [selectedProjectId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Parse date from input text
      const parsedDate = parseDateFromText(input);
      
      // Clean the input text by removing date-related keywords
      const cleanTitle = input
        .replace(/\b(today|tomorrow|next week|next month)\b/gi, '')
        .replace(/\d{1,2}[\/\-\.]\d{1,2}/g, '')
        .trim();
      
      const taskData = {
        title: cleanTitle || input,
        projectId: selectedProject,
        priority: priority,
        dueDate: parsedDate ? parsedDate.toISOString() : null
      };
      
      await onAdd(taskData);
      
      // Reset form
      setInput('');
      setPriority(3);
      setIsExpanded(false);
      
      // Keep focus on input for continuous adding
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setInput('');
      setIsExpanded(false);
    }
  };
  
  const priorityOptions = [
    { value: 1, label: 'High', color: '#EF4444' },
    { value: 2, label: 'Medium', color: '#F59E0B' },
    { value: 3, label: 'Low', color: '#3B82F6' }
  ];
  
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
      animate={{ 
        height: isExpanded ? 'auto' : 'auto',
        boxShadow: isExpanded 
          ? '0 20px 25px -5px rgba(139, 92, 246, 0.1)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a new task... (try 'Review slides tomorrow' or 'Call client 12/28')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon="Plus"
            loading={isSubmitting}
            disabled={!input.trim() || isSubmitting}
            className="shrink-0"
          />
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <select
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                >
                  <option value="">No Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex space-x-2">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        priority === option.value
                          ? 'text-white shadow-md'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: priority === option.value ? option.color : undefined
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-500">
                💡 Try typing "tomorrow", "next week", or "12/28" to set due dates
              </p>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsExpanded(false);
                    setInput('');
                    setPriority(3);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default TaskQuickAdd;