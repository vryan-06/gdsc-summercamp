// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BasicDetailStorage {
    struct Details {
        string name;
        uint256 age;
        string email;
    }

    Details[] public allDetails;

    function setDetails(string memory _name, uint256 _age, string memory _email) public {
        Details memory newDetails = Details(_name, _age, _email);
        allDetails.push(newDetails);
    }

    function getDetails(uint256 index) public view returns (string memory, uint256, string memory) {
        require(index < allDetails.length, "Invalid index");
        Details memory details = allDetails[index];
        return (details.name, details.age, details.email);
    }

    function getDetailsCount() public view returns (uint256) {
        return allDetails.length;
    }
}