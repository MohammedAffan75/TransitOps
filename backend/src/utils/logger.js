const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  },
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  }
};

export default logger;
