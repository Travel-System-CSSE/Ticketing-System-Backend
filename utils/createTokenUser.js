const createTokenUser = (user) => {
  return Object.assign(
    { userId: user._id, name: user.name, role: user.role, qrCode: user.qrCode },
    user.nationalID && { nationalID: user.nationalID },
    user.passportNumber && { passportNumber: user.passportNumber }
  )
}

module.exports = createTokenUser
