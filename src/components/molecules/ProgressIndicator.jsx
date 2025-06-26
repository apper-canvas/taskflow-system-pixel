import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ProgressIndicator = ({ 
  completed = 0, 
  total = 0, 
  label = "Today's Progress",
  showDetails = true,
  size = 'md',
  className = '' 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-xs', icon: 12 },
    md: { container: 'w-20 h-20', text: 'text-sm', icon: 16 },
    lg: { container: 'w-24 h-24', text: 'text-base', icon: 20 }
  };
  
  const currentSize = sizes[size];
  
  return (
    <motion.div
      className={`flex items-center space-x-4 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Circular Progress */}
      <div className={`relative ${currentSize.container}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B21B6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {percentage === 100 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <ApperIcon 
                name="CheckCircle" 
                size={currentSize.icon} 
                className="text-green-500" 
              />
            </motion.div>
          ) : (
            <motion.span
              className={`font-bold text-gray-800 ${currentSize.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {percentage}%
            </motion.span>
          )}
        </div>
      </div>
      
      {/* Details */}
      {showDetails && (
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary-600">{completed}</span>
            <span className="mx-1">of</span>
            <span className="font-medium">{total}</span>
            <span className="ml-1">tasks completed</span>
          </div>
          
          {percentage === 100 && total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1 }}
              className="flex items-center mt-2 text-sm text-green-600 font-medium"
            >
              <ApperIcon name="Sparkles" size={14} className="mr-1" />
              All done! Great work! 🎉
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressIndicator;