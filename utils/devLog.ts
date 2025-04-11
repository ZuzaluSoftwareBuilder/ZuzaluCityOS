/**
 * Development-only logger with colored output.
 * Only logs messages when process.env.NODE_ENV is 'development'.
 */

// Define styles for different log levels
const styles = {
  log: 'background: #E0E0E0; color: #333; padding: 2px 4px; border-radius: 2px;', // Light gray background, dark text
  warn: 'background: #FFF3CD; color: #856404; padding: 2px 4px; border-radius: 2px;', // Light yellow background, dark yellow text
  error:
    'background: #F8D7DA; color: #721C24; padding: 2px 4px; border-radius: 2px;', // Light red background, dark red text
};

const devLog = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('%cLOG', styles.log, ...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('%cWARN', styles.warn, ...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('%cERROR', styles.error, ...args);
    }
  },
};

export default devLog;
