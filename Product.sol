
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract ProductStore {
    struct Product {
        string name;
        uint256 price;
        bool isBought;
    }

    mapping(uint256 => Product) public products;
    mapping(address => string) public users;

    address public owner;
    uint256 public productCount; // Track total products dynamically

    event ProductBought(address indexed buyer, uint256 indexed productId, string productName, uint256 price);
    event UserRegistered(address indexed user, string name);
    event ProductAdded(uint256 indexed productId, string name, uint256 price);
    event ProductUpdated(uint256 indexed productId, string name, uint256 price);
    
    constructor() {
        owner = msg.sender;

        // Initialize 10 products
        addInitialProducts();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addInitialProducts() internal {
        string[10] memory names = ["Laptop", "Phone", "Tablet", "Headphones", "Smartwatch",
                                   "Camera", "Monitor", "Keyboard", "Mouse", "Speaker"];
        uint256[10] memory prices = [uint256(1000), uint256(800), uint256(500), uint256(200), uint256(300), uint256(1200), uint256(400), uint256(100), uint256(50), uint256(150)];


        for (uint256 i = 0; i < 10; i++) {
            products[i + 1] = Product(names[i], prices[i], false);
        }
        productCount = 10;
    }

    function registerUser(string memory _name) public {
        require(bytes(_name).length > 0 && bytes(_name).length <= 32, "Invalid name length");
        users[msg.sender] = _name;
        emit UserRegistered(msg.sender, _name);
    }

    function buyProduct(uint256 _productId) public payable {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        Product storage product = products[_productId];
        require(!product.isBought, "Already bought");
        require(msg.value >= product.price, "Insufficient payment");

        product.isBought = true;
        emit ProductBought(msg.sender, _productId, product.name, product.price);

        payable(owner).transfer(msg.value);
    }

    function restockProduct(uint256 _productId) public onlyOwner {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        products[_productId].isBought = false;
    }

    function getUser(address _user) public view returns (string memory) {
        return users[_user];
    }

    function isProductBought(uint256 _productId) public view returns (bool) {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        return products[_productId].isBought;
    }

    function getProductDetails(uint256 _productId) public view returns (string memory, uint256, bool) {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        Product memory product = products[_productId];
        return (product.name, product.price, product.isBought);
    }

    function withdrawFunds() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function addProduct(string memory _name, uint256 _price) public onlyOwner {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        productCount++;
        products[productCount] = Product(_name, _price, false);

        emit ProductAdded(productCount, _name, _price);
    }

    function updateProduct(uint256 _productId, string memory _name, uint256 _price) public onlyOwner {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        products[_productId].name = _name;
        products[_productId].price = _price;

        emit ProductUpdated(_productId, _name, _price);
    }

    receive() external payable {
        revert("Direct Ether transfers are not allowed. Use the buyProduct function.");
    }
}
