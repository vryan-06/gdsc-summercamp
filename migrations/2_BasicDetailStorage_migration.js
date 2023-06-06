const BasicDetailStorage = artifacts.require("BasicDetailStorage");

module.exports = function(deployer) {
  // Command Truffle to deploy the Smart Contract
  deployer.deploy(BasicDetailStorage);
};