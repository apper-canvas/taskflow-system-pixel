import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import ProgressIndicator from '@/components/molecules/ProgressIndicator';

const Header = ({ 
  searchValue = '', 
  onSearchChange,
  onSearchClear,
  taskStats = {},
  className = '' 
}) => {
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 
    ? 'Good morning' 
    : currentTime.getHours() < 17 
      ? 'Good afternoon' 
      : 'Good evening';
  
  return (
    <motion.header
      className={`bg-white border-b border-gray-200 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left Section - Greeting and Logo */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">TaskFlow</h1>
                <p className="text-sm text-gray-600">{greeting}! Let's get things done.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-auto lg:mx-4">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              onClear={onSearchClear}
              placeholder="Search your tasks..."
            />
          </div>
          
          {/* Right Section - Progress */}
          <div className="flex items-center space-x-4">
            <ProgressIndicator
              completed={taskStats.completed || 0}
              total={taskStats.total || 0}
              label="Today's Progress"
              showDetails={false}
              size="md"
            />
            
            {/* Additional Stats */}
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              {taskStats.overdue > 0 && (
                <motion.div
                  className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ApperIcon name="AlertTriangle" size={14} />
                  <span className="font-medium">{taskStats.overdue} overdue</span>
                </motion.div>
              )}
              
              {taskStats.today > 0 && (
                <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <ApperIcon name="Clock" size={14} />
                  <span className="font-medium">{taskStats.today} due today</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;