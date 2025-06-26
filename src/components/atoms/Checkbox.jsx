import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  const baseClasses = `relative inline-flex items-center justify-center rounded border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`;
  
  const stateClasses = checked
    ? 'bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500 text-white'
    : 'bg-white border-gray-300 hover:border-primary-400';
  
  const classes = `${baseClasses} ${sizes[size]} ${stateClasses} ${className}`;
  
  return (
    <motion.button
      type="button"
      className={classes}
      onClick={() => !disabled && onChange && onChange(!checked)}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{ 
        scale: checked ? [1, 1.1, 1] : 1,
        rotate: checked ? [0, 5, -5, 0] : 0
      }}
      transition={{ 
        scale: { duration: 0.3, ease: "easeOut" },
        rotate: { duration: 0.3, ease: "easeOut" }
      }}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ApperIcon name="Check" size={iconSizes[size]} />
        </motion.div>
      )}
    </motion.button>
  );
};

export default Checkbox;