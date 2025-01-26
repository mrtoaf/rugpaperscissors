// src/App.js
import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ChakraProvider, Box, Heading, VStack, Button, Text } from '@chakra-ui/react';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import SelectMove from './components/SelectMove';
import ReadyUp from './components/ReadyUp';
import GameStatus from './components/GameStatus';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl" p={4}>
        <WalletMultiButton />
        <VStack spacing={8} mt={8}>
          <Heading>Rock-Paper-Scissors on Solana</Heading>
          {currentView === 'home' && (
            <VStack spacing={4}>
              <Button colorScheme="teal" onClick={() => setCurrentView('create')}>
                Create Game
              </Button>
              <Button colorScheme="blue" onClick={() => setCurrentView('join')}>
                Join Game
              </Button>
              <Button colorScheme="purple" onClick={() => setCurrentView('selectMove')}>
                Select Move
              </Button>
              <Button colorScheme="orange" onClick={() => setCurrentView('readyUp')}>
                Ready Up
              </Button>
              <Button colorScheme="green" onClick={() => setCurrentView('status')}>
                Game Status
              </Button>
            </VStack>
          )}
          {currentView === 'create' && <CreateGame setCurrentView={setCurrentView} />}
          {currentView === 'join' && <JoinGame setCurrentView={setCurrentView} />}
          {currentView === 'selectMove' && <SelectMove setCurrentView={setCurrentView} />}
          {currentView === 'readyUp' && <ReadyUp setCurrentView={setCurrentView} />}
          {currentView === 'status' && <GameStatus setCurrentView={setCurrentView} />}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
