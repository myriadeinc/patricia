const blockUtil = require('cryptoforknote-util');
const hashUtil = require('cryptonight-hashing');

/**
 * 
 * [Methods in cryptoforknote-util]:
 * 'construct_block_blob',
 * 'get_block_id',
 * 'convert_blob',
 * 'address_decode',
 * 'address_decode_integrated',
 * 'get_merged_mining_nonce_size',
 * 'construct_mm_parent_block_blob',
 * 'construct_mm_child_block_blob',
 * 'path'
 * 
 * [Methods in cryptonight-hashing]:
 * 'cryptonight'
 * 'cryptonight_light'
 * 'cryptonight_heavy'
 * 'cryptonight_pico'
 * 'randomx'
 * 'argon2'
 * 'astrobwt'
 * 'k12'
 * 'c29s'
 * 'c29v'
 * 'c29_cycle_hash'
 * 'path'
 */
const xmr = {
  /**
 * @param {Buffer} buffer
 * @param {Buffer} nonceData
 * @return {Buffer} Block in raw bytes (Buffer object)
 */
  construct_block_blob: (buffer, nonceData) => {
    return blockUtil.construct_block_blob(buffer, nonceData, 0);
  },
  /**
 * @param {Buffer} blob The block in raw bytes
 * @param {Buffer} seed_hash The seed_hash for randomx in raw bytes
 * @return {Buffer} Hashed block in raw bytes (Buffer object), must convert to hex string
 * @Doc We use the constant 0 to sepcify Monero's randomx configuration
 */
  randomx: (blob, seed_hash) => {
    return hashUtil.randomx(blob, seed_hash, 0);
  },
  convert_blob: (blob) => {
    return blockUtil.convert_blob(blob, 0)
  }
};
module.exports = xmr;
