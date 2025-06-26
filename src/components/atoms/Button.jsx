import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-primary-500',
    secondary: 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-secondary-500',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-accent-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:scale-105 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:scale-105 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin mr-2" 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'mr-2' : ''} 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'ml-2' : ''} 
        />
      )}
    </motion.button>
  );
};

export default Button;