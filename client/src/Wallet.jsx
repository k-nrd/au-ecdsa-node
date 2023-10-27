function Wallet({ balance, privateKey, setPrivateKey }) {
  const onPrivateKeyChange = (evt) => {
    const pk = evt.target.value;
    setPrivateKey(pk);
  };

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your private key, for example: 62cb37..."
          value={privateKey}
          onChange={onPrivateKeyChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
