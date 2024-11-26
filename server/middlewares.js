export const isLoggedIn = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json("Du är inte inloggad");
  }
  next();
};
