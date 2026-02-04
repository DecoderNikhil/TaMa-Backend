export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
