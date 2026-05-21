export const guestUserInfo = async (req, res, next) => {
    const tempId = req.cookies?.tempId || null;
    req.tempId = tempId;
    next();
}