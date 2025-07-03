import { motion } from 'framer-motion';

const Badge = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    primary: 'bg-gradient-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
    neutral: 'bg-gray-100 text-gray-800',
    outline: 'border-2 border-primary text-primary bg-transparent',
  };
  
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };
  
  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={badgeClasses}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;