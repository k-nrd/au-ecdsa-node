const path = require('path')
const fs = require('fs')
const express = require("express");
const cors = require("cors");
const { secp256k1 } = require('ethereum-cryptography/secp256k1')

const app = express();
const port = 3042;
// 1 minute
const TOKEN_LIFETIME = 1000 * 60

app.use(cors());
app.use(express.json());

const tokens = new Set()
const balancesPath = path.join(__dirname, 'balances.json')
const balances = JSON.parse(fs.readFileSync(balancesPath))

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get('/token', (req, res) => {
  const token = Math.random().toString(36).slice(2)
  tokens.add(token)
  setTimeout(() => {
    tokens.delete(token)
  }, TOKEN_LIFETIME)
  res.status(200).send({ token })
})

app.post("/send", (req, res) => {
  const { sender, signature, recipient, amount, messageHash, token } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!tokens.has(token)) {
    res.status(403).send({ message: "Invalid token." });
  } else if (!verifySignature(signature, messageHash, sender)) {
    res.status(403).send({ message: "Couldn't verify signature of sender." });
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.status(200).send({ balance: balances[sender] });
    fs.writeFileSync(balancesPath, JSON.stringify(balances))
    tokens.delete(token)
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function verifySignature(signature, messageHash, sender) {
  return secp256k1.verify(signature, messageHash, sender)
}

