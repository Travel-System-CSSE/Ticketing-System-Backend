const QRCode = require('qrcode')

const generateQR = async (name, nationalID, passportNumber, role) => {
  try {
    return await QRCode.toDataURL([
      { data: name, mode: 'byte' },
      { data: nationalID, mode: 'byte' },
      { data: passportNumber, mode: 'byte' },
      { data: role, mode: 'byte' },
    ])
  } catch (err) {
    console.error(err)
  }
}

module.exports = generateQR
