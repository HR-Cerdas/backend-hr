const ayo = async (req, res, next) => {
  const semua = req.user;

  return res.status(200).json({
    msg: semua,
  });
};

module.exports = { ayo };
