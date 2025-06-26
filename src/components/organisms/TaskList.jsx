import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/organisms/TaskCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = '', 
  onTaskUpdate, 
  onTaskDelete,
  onRetry,
  projects = [],
  emptyMessage = "No tasks found",
  emptyDescription = "Create your first task to get started!",
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="AlertTriangle" size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          {error}
        </p>
        <Button
          variant="primary"
          onClick={onRetry}
          icon="RefreshCw"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="CheckSquare" size={32} className="text-primary-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {emptyDescription}
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 0.05,
                duration: 0.3,
                ease: 'easeOut'
              }
            }}
            exit={{ 
              opacity: 0, 
              x: -100,
              transition: { duration: 0.2 }
            }}
          >
            <TaskCard
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              projects={projects}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;