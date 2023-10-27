import { useState } from "react";
import { toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import server from "./server";
import { useEffect } from "react";

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [derivedMessageHash, setDerivedMessageHash] = useState("");
  const [derivedSignature, setDerivedSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  useEffect(() => {
    try {
      const amount = parseInt(sendAmount);
      const msg = JSON.stringify({ amount });
      const encoder = new TextEncoder();
      const bytes = encoder.encode(msg);
      setDerivedMessageHash(toHex(bytes));
    } catch (_) {
      setDerivedMessageHash("");
    }
  }, [sendAmount]);

  useEffect(() => {
    try {
      setDerivedSignature(
        secp256k1.sign(derivedMessageHash, privateKey).toCompactHex(),
      );
    } catch (err) {
      setDerivedSignature("");
    }
  }, [derivedMessageHash, privateKey]);

  const transfer = (evt) => {
    evt.preventDefault();

    try {
      const amount = parseInt(sendAmount);

      server
        .get("/token")
        .then(({ data: { token } }) =>
          server.post("send", {
            sender: address,
            signature: derivedSignature,
            recipient,
            amount,
            messageHash: derivedMessageHash,
            token,
          }),
        )
        .then(({ data: { balance } }) => {
          setBalance(balance);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (ex) {
      alert(ex);
    }
  };

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <pre>Message Hash: {derivedMessageHash}</pre>
      <pre>Signature: {derivedSignature}</pre>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <button type="submit" className="button">
        Sign and Transfer
      </button>
    </form>
  );
}

export default Transfer;
