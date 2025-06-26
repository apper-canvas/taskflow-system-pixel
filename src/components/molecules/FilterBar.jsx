import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  filters = {},
  onFilterChange,
  taskCounts = {},
  className = '' 
}) => {
  const filterButtons = [
    {
      key: 'all',
      label: 'All Tasks',
      icon: 'List',
      count: taskCounts.total || 0,
      active: !filters.completed && !filters.overdue && !filters.today
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: 'Clock',
      count: taskCounts.pending || 0,
      active: filters.completed === false
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: 'CheckCircle',
      count: taskCounts.completed || 0,
      active: filters.completed === true
    },
    {
      key: 'today',
      label: 'Due Today',
      icon: 'CalendarDays',
      count: taskCounts.today || 0,
      active: filters.today === true
    },
    {
      key: 'overdue',
      label: 'Overdue',
      icon: 'AlertTriangle',
      count: taskCounts.overdue || 0,
      active: filters.overdue === true,
      variant: 'error'
    }
  ];
  
  const handleFilterClick = (filterKey) => {
    let newFilters = { ...filters };
    
    switch (filterKey) {
      case 'all':
        newFilters = {};
        break;
      case 'pending':
        newFilters = { completed: false };
        break;
      case 'completed':
        newFilters = { completed: true };
        break;
      case 'today':
        newFilters = { today: true };
        break;
      case 'overdue':
        newFilters = { overdue: true };
        break;
      default:
        break;
    }
    
    onFilterChange(newFilters);
  };
  
  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {filterButtons.map(button => (
        <motion.button
          key={button.key}
          onClick={() => handleFilterClick(button.key)}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            button.active
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
          }`}
          whileHover={{ scale: button.active ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name={button.icon} size={16} />
          <span>{button.label}</span>
          <Badge 
            variant={button.active ? 'default' : 'primary'}
            size="sm"
            className={`${
              button.active 
                ? 'bg-white/20 text-white' 
                : button.variant === 'error' && button.count > 0
                  ? 'bg-red-100 text-red-800'
                  : ''
            }`}
          >
            {button.count}
          </Badge>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default FilterBar;