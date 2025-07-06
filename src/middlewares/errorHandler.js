export const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
};
