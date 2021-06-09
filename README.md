# patricia
Bare exposure for monero libraries

There are two libraries that we don't have the time for making compatible with go : 
- node-cryptoforknote-util -> for creating monero blocks and translation between hex representation/raw binary format
- node-cryptonight-hashing -> for exposure to the randomx hashing function

Since these functions are only used for a small (but important) component of a mining pool, we expose these libraries over grpc and add our mining pool logic to this wrapper