export const getStates = (req, res) => {
  const states = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  res.status(200).json({ states });
};
