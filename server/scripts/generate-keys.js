const fs = require('fs')
const path = require('path')
const { secp256k1 } = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")

const balances = {}

for (let index = 0; index < 5; index++) {
  const privateKey = toHex(secp256k1.utils.randomPrivateKey())
  const publicKey = toHex(secp256k1.getPublicKey(privateKey))
  console.group(`Key pair #${index}`)
  console.log(`Private Key: ${privateKey}`)
  console.log(`Public Key: ${publicKey}`)
  console.groupEnd()
  balances[publicKey] = Math.random() * 100
}

fs.writeFileSync(path.join(__dirname, '..', 'balances.json'), JSON.stringify(balances))
