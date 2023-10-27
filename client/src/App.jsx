import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import server from "./server";
import { useEffect } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const fetchBalance = async () => {
    if (address) {
      return await server.get(`balance/${address}`);
    }
  };

  useEffect(() => {
    fetchBalance()
      .then(({ data: { balance } }) => {
        setBalance(balance);
      })
      .catch(() => {
        setBalance(0);
      });
  }, [address]);

  useEffect(() => {
    try {
      const publicKey = secp256k1.getPublicKey(privateKey);
      setAddress(toHex(publicKey));
    } catch (error) {
      console.log(error);
      setAddress("");
    }
  }, [privateKey]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer
        address={address}
        privateKey={privateKey}
        setBalance={setBalance}
      />
    </div>
  );
}

export default App;
