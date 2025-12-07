export const logEvent = (message, meta = {}) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${message}`, Object.keys(meta).length ? meta : '');
};
