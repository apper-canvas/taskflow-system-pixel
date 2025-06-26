import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import {
  formatMonthYear,
  formatDayOfMonth,
  formatDate,
  getCalendarDays,
  getTasksForDate,
  getDateStatus,
  addMonths,
  isSameMonth,
  isSameDay,
  isOverdue,
  isDueToday
} from '@/utils/dateHelpers';

const CalendarWidget = ({ tasks = [], loading = false, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'day'

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => getCalendarDays(currentDate), [currentDate]);

  // Get tasks for the selected date
  const selectedDateTasks = useMemo(() => 
    getTasksForDate(tasks, selectedDate), [tasks, selectedDate]
  );

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setView('day');
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setView('day');
  };

  const getTaskCountForDate = (date) => {
    const tasksForDate = getTasksForDate(tasks, date);
    return tasksForDate.filter(task => !task.completed).length;
  };

  const getDateClasses = (date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const taskCount = getTaskCountForDate(date);
    const hasOverdue = getTasksForDate(tasks, date).some(task => !task.completed && isOverdue(task.dueDate));
    const hasTodayTasks = getTasksForDate(tasks, date).some(task => !task.completed && isDueToday(task.dueDate));

    let classes = 'relative p-2 h-20 border border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 flex flex-col justify-between';

    if (!isCurrentMonth) {
      classes += ' text-gray-400 bg-gray-50';
    }

    if (isSelected) {
      classes += ' bg-blue-100 border-blue-300';
    }

    if (isToday) {
      classes += ' bg-blue-50 border-blue-200 font-semibold';
    }

    return classes;
  };

  const renderTaskIndicator = (date) => {
    const tasksForDate = getTasksForDate(tasks, date);
    const incompleteTasks = tasksForDate.filter(task => !task.completed);
    
    if (incompleteTasks.length === 0) return null;

    const hasOverdue = incompleteTasks.some(task => isOverdue(task.dueDate));
    const hasToday = incompleteTasks.some(task => isDueToday(task.dueDate));

    let color = 'bg-blue-500';
    if (hasOverdue) color = 'bg-red-500';
    else if (hasToday) color = 'bg-amber-500';

    return (
      <div className={`absolute top-1 right-1 w-5 h-5 ${color} text-white text-xs rounded-full flex items-center justify-center font-medium`}>
        {incompleteTasks.length > 9 ? '9+' : incompleteTasks.length}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'day' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon="Calendar"
            onClick={goToToday}
          >
            Today
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={goToPreviousMonth}
            />
            <h3 className="text-lg font-medium text-gray-900 min-w-[180px] text-center">
              {view === 'month' ? formatMonthYear(currentDate) : formatDate(selectedDate)}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={goToNextMonth}
            />
          </div>
          
          {view === 'day' && (
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => setView('month')}
            >
              Back to Month
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {view === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => (
                  <motion.div
                    key={index}
                    className={getDateClasses(date)}
                    onClick={() => handleDateClick(date)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-medium">
                      {formatDayOfMonth(date)}
                    </div>
                    {renderTaskIndicator(date)}
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Overdue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Due Today</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Upcoming</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="day"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Day Header */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {formatDate(selectedDate)}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''} due
                </p>
              </div>

              {/* Tasks for Selected Date */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks due on this date</p>
                  </div>
                ) : (
                  selectedDateTasks.map(task => (
                    <motion.div
                      key={task.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => onTaskClick?.(task)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            task.completed ? 'bg-green-500' :
                            isOverdue(task.dueDate) ? 'bg-red-500' :
                            isDueToday(task.dueDate) ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {task.completed && (
                                <Badge variant="success" size="sm">Completed</Badge>
                              )}
                              {!task.completed && isOverdue(task.dueDate) && (
                                <Badge variant="error" size="sm">Overdue</Badge>
                              )}
                              {!task.completed && isDueToday(task.dueDate) && (
                                <Badge variant="warning" size="sm">Due Today</Badge>
                              )}
                              <Badge variant="secondary" size="sm">
                                Priority {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarWidget;