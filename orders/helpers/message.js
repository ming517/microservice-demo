exports.success = data => ({
  success: true,
  data,
});

exports.error = (type, message) => ({
  success: false,
  type,
  message,
});
