// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to access this resource' });
};

// Membership status check middleware
const isMember = (req, res, next) => {
  if (req.isAuthenticated() && 
      (req.user.membershipStatus === 'member' || req.user.membershipStatus === 'admin')) {
    return next();
  }
  res.status(403).json({ message: 'You must be a member to access this resource' });
};

// Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

// Expose user data based on membership status
const filterUserData = (user, requestingUser) => {
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    membershipStatus: user.membershipStatus,
    isAdmin: user.isAdmin
  };

  // If not authenticated or not a member, remove sensitive information
  if (!requestingUser || requestingUser.membershipStatus === 'regular') {
    delete userData.firstName;
    delete userData.lastName;
  }

  return userData;
};

module.exports = {
  isAuthenticated,
  isMember,
  isAdmin,
  filterUserData
};