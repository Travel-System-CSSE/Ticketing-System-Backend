const createTokenUser = (user) => {
  return {
    userId: user._id,
    name: user.name,
    role: user.role,
    idNumber: user.idNumber,
  }
}

module.exports = createTokenUser
