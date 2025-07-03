import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { formatTime } from '@/utils/helpers';

const InstructionsList = ({ instructions }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeTimers, setActiveTimers] = useState(new Map());
  
  const toggleStepCompletion = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };
  
  const startTimer = (stepNumber, duration) => {
    const endTime = Date.now() + (duration * 60 * 1000);
    const newTimers = new Map(activeTimers);
    newTimers.set(stepNumber, { endTime, duration });
    setActiveTimers(newTimers);
    
    // Update timer every second
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      if (remaining <= 0) {
        clearInterval(interval);
        const updatedTimers = new Map(activeTimers);
        updatedTimers.delete(stepNumber);
        setActiveTimers(updatedTimers);
        // Could add notification here
      }
    }, 1000);
  };
  
  const stopTimer = (stepNumber) => {
    const newTimers = new Map(activeTimers);
    newTimers.delete(stepNumber);
    setActiveTimers(newTimers);
  };
  
  const getTimerDisplay = (stepNumber) => {
    const timer = activeTimers.get(stepNumber);
    if (!timer) return null;
    
    const remaining = Math.max(0, timer.endTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
        Instructions
      </h3>
      
      <div className="space-y-4">
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(instruction.stepNumber);
          const hasTimer = instruction.duration > 0;
          const isTimerActive = activeTimers.has(instruction.stepNumber);
          const timerDisplay = getTimerDisplay(instruction.stepNumber);
          
          return (
            <motion.div
              key={instruction.stepNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCompleted 
                  ? 'border-success bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-primary/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStepCompletion(instruction.stepNumber)}
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-success border-success text-white' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {isCompleted ? (
                    <ApperIcon name="Check" className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{instruction.stepNumber}</span>
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`text-gray-900 leading-relaxed ${
                    isCompleted ? 'line-through text-gray-500' : ''
                  }`}>
                    {instruction.text}
                  </p>
                  
                  {hasTimer && (
                    <div className="flex items-center gap-2 mt-3">
                      {isTimerActive ? (
                        <div className="flex items-center gap-2">
                          <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                            {timerDisplay}
                          </div>
                          <Button
                            variant="ghost"
                            size="small"
                            icon="StopCircle"
                            onClick={() => stopTimer(instruction.stepNumber)}
                          >
                            Stop
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="small"
                          icon="Timer"
                          onClick={() => startTimer(instruction.stepNumber, instruction.duration)}
                        >
                          Start Timer ({formatTime(instruction.duration)})
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InstructionsList;