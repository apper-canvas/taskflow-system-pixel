import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { formatDate, isOverdue, isDueToday, formatDateForInput } from '@/utils/dateHelpers';
import { getPriorityColor, getPriorityLabel, getPriorityBorderWidth } from '@/utils/taskHelpers';

const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  projects = [],
  className = '',
  ...props 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const editInputRef = useRef(null);
  
  const project = projects.find(p => p.id === task.projectId);
  const priorityColor = getPriorityColor(task.priority);
  const priorityBorderWidth = getPriorityBorderWidth(task.priority);
  
  const handleToggleComplete = async () => {
    await onUpdate(task.id, { completed: !task.completed });
  };
  
  const handleSaveEdit = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      await onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  const handlePriorityChange = async (newPriority) => {
    await onUpdate(task.id, { priority: newPriority });
    setShowOptions(false);
  };
  
  const handleDueDateChange = async (e) => {
    const date = e.target.value ? new Date(e.target.value).toISOString() : null;
    await onUpdate(task.id, { dueDate: date });
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };
  
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    if (isOverdue(task.dueDate)) {
      return { variant: 'error', icon: 'AlertTriangle', text: formatDate(task.dueDate) };
    } else if (isDueToday(task.dueDate)) {
      return { variant: 'warning', icon: 'Clock', text: 'Today' };
    } else {
      return { variant: 'info', icon: 'Calendar', text: formatDate(task.dueDate) };
    }
  };
  
  const dueDateStatus = getDueDateStatus();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isDeleting ? 0 : 1, 
        y: isDeleting ? -20 : 0, 
        scale: isDeleting ? 0.95 : 1,
        x: 0
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${
        task.completed ? 'opacity-75' : ''
      } ${className}`}
      style={{ borderLeftColor: priorityColor, borderLeftWidth: priorityBorderWidth }}
      whileHover={{ scale: 1.01, y: -2 }}
      {...props}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              size="md"
            />
          </motion.div>
          
          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            {isEditing ? (
              <input
                ref={editInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                autoFocus
              />
            ) : (
              <motion.h3
                className={`font-medium text-gray-900 cursor-pointer hover:text-primary-600 transition-colors duration-200 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.01 }}
              >
                {task.title}
              </motion.h3>
            )}
            
            {/* Metadata */}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {/* Project Badge */}
              {project && (
                <Badge
                  variant="default"
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name}
                </Badge>
              )}
              
              {/* Priority Badge */}
              <Badge
                variant="default"
                size="sm"
                className="text-white"
                style={{ backgroundColor: priorityColor }}
              >
                {getPriorityLabel(task.priority)}
              </Badge>
              
              {/* Due Date Badge */}
              {dueDateStatus && (
                <Badge variant={dueDateStatus.variant} size="sm">
                  <ApperIcon name={dueDateStatus.icon} size={12} className="mr-1" />
                  {dueDateStatus.text}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Quick Priority Toggle */}
            <motion.button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="MoreVertical" size={16} />
            </motion.button>
          </div>
        </div>
        
        {/* Extended Options */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map(priority => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityChange(priority)}
                        className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          task.priority === priority
                            ? 'text-white shadow-sm'
                            : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: task.priority === priority ? getPriorityColor(priority) : undefined
                        }}
                      >
                        {getPriorityLabel(priority)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Due Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={task.dueDate ? formatDateForInput(task.dueDate) : ''}
                    onChange={handleDueDateChange}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex items-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit3"
                    onClick={() => {
                      setIsEditing(true);
                      setShowOptions(false);
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    icon="Trash2"
                    onClick={handleDelete}
                    loading={isDeleting}
                    className="flex-1"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskCard;