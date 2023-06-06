import { useState, useEffect } from 'react';
import { contract } from '../services/web3';
import Web3 from 'web3';

const Home = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [transactionHash, setTransactionHash] = useState('');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetchAllDetails();
  }, []);

  const connectWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    } else {
      alert('Please install MetaMask to use this application');
    }
  };

  const handleSetDetails = async (e) => {
    e.preventDefault();
    if (!contract) return;
    try {
      const result = await contract.methods
        .setDetails(name, age, email)
        .send({ from: accounts[0], gas: 3000000 });
      setTransactionHash(result.transactionHash);
      alert('Details stored successfully!');
      fetchAllDetails(); // Refresh the details after storing
    } catch (error) {
      console.error(error);
      alert('Error storing details!');
    }
  };

  const fetchAllDetails = async () => {
    try {
      const count = await contract.methods.getDetailsCount().call();
      const fetchedDetails = [];
      for (let i = 0; i < count; i++) {
        const detail = await contract.methods.getDetails(i).call();
        fetchedDetails.push(detail);
      }
      console.log(fetchedDetails);
      setDetails(fetchedDetails);
    } catch (error) {
      console.error(error);
      alert('Error fetching details!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Basic Details Storage</h1>
      {!accounts[0] ? (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={connectWeb3}
        >
          Connect MetaMask
        </button>
      ) : (
        <form onSubmit={handleSetDetails} className="max-w-sm mx-auto mt-4">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block mb-2 font-medium">
              Age:
            </label>
            <input
              type="number"
              id="age"
              value={age}
              required
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      )}
      {transactionHash && (
        <div className="mt-4">
          <p>
            Transaction Hash: <span className="font-medium">{transactionHash}</span>
          </p>
        </div>
      )}
      {details.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Stored Details:</h2>
          <div className="flex flex-col gap-4">
            {details.map((detail, index) => (
              <div key={index} className="bg-white shadow-lg p-4 rounded-lg">
                <p className="text-lg font-bold">Name: {detail[0]}</p>
                <p className="text-gray-600">Age: {detail[1]}</p>
                <p className="text-gray-600">Email: {detail[2]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
