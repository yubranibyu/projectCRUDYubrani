const IsAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized: You must log in first' });
  }
  next();
};

module.exports = { IsAuthenticated };
