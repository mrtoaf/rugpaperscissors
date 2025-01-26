// src/anchor.js
import { AnchorProvider, Program, web3, BN } from '@project-serum/anchor';
import idl from './idl/rps_game.json';
import { useMemo } from 'react';

// Configure the network to connect to (Localnet or Devnet)
const network = 'http://127.0.0.1:8899'; // Update if using Devnet

// Create a connection to the Solana cluster
const connection = new web3.Connection(network, 'processed');

// Access the wallet (Phantom)
const wallet = window.solana;

// Check if the wallet is connected
if (!wallet) {
  alert("Please install a Solana wallet like Phantom to use this app.");
}

// Create the provider
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

// Initialize the program
const programID = new web3.PublicKey(idl.metadata.address);
const program = new Program(idl, programID, provider);

export { program, provider, web3, BN };
