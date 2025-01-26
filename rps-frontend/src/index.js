// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  // Add other wallets here if needed
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';
import { ChakraProvider } from '@chakra-ui/react';

const network = WalletAdapterNetwork.Localnet; // Change to 'Devnet' if using devnet

const wallets = [
  new PhantomWalletAdapter(),
  // Add other wallets here
];

ReactDOM.render(
  <React.StrictMode>
    <ConnectionProvider endpoint="http://127.0.0.1:8899"> {/* Update if using Devnet */}
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
