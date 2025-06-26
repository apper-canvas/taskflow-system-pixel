import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ 
  value = '', 
  onChange, 
  onClear,
  placeholder = 'Search tasks...',
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ 
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused 
          ? '0 10px 25px -5px rgba(139, 92, 246, 0.1)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            size={18} 
            className="text-gray-400" 
          />
        </div>
        
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 bg-white border-2 border-gray-200 focus:border-primary-400 focus:ring-primary-400"
        />
        
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={() => {
              onClear && onClear();
              onChange && onChange('');
            }}
          >
            <ApperIcon name="X" size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;