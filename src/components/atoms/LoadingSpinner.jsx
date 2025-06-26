import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };
  
  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    gray: 'text-gray-500',
    white: 'text-white'
  };
  
  const classes = `${colors[color]} ${className}`;
  
  return (
    <motion.div
      className="flex items-center justify-center"
      {...props}
    >
      <ApperIcon 
        name="Loader2" 
        size={sizes[size]} 
        className={`animate-spin ${classes}`}
      />
    </motion.div>
  );
};

export default LoadingSpinner;