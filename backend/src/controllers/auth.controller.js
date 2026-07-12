// Dummy handlers until teammate implements Auth Phase
export const register = (req, res) => {
  res.status(501).json({ message: 'Auth register not implemented yet' });
};

export const login = (req, res) => {
  res.status(501).json({ message: 'Auth login not implemented yet' });
};
