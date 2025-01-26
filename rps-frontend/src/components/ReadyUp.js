// src/components/ReadyUp.js
import React, { useState, useEffect } from 'react';
import { program, provider, web3, BN } from '../anchor';
import { Button, VStack, Text, Select, Alert, AlertIcon } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';

const GAME_SEED = "game";

const ReadyUp = ({ setCurrentView }) => {
  const [gamePdas, setGamePdas] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [message, setMessage] = useState('');

  // Fetch games the user is part of
  const fetchUserGames = async () => {
    try {
      const gameAccounts = await program.account.gameState.all([
        // Potential filters can be added here
      ]);

      // Filter games where the user is the creator or the joiner and not yet ended
      const activeGames = gameAccounts.filter(game => 
        (game.account.creator.toBase58() === provider.wallet.publicKey.toBase58() ||
          (game.account.opponent && game.account.opponent.toBase58() === provider.wallet.publicKey.toBase58())) &&
        game.account.status !== "Ended"
      );

      setGamePdas(activeGames.map(game => game.publicKey.toBase58()));
    } catch (error) {
      console.error(error);
      setMessage(`Error fetching user games: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserGames();
  }, []);

  const handleReadyUp = async () => {
    try {
      if (!selectedGame) {
        setMessage("Please select a game.");
        return;
      }

      // Send transaction to ready_up
      await program.rpc.readyUp({
        accounts: {
          gameAccount: new PublicKey(selectedGame),
          player: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [],
      });

      setMessage(`Ready up successfully for game PDA: ${selectedGame}`);
      setCurrentView('home');
    } catch (error) {
      console.error(error);
      setMessage(`Error readying up: ${error.message}`);
    }
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="lg">Ready Up</Text>
      <Select placeholder="Select a Game" onChange={(e) => setSelectedGame(e.target.value)}>
        {gamePdas.map((pda) => (
          <option key={pda} value={pda}>
            {pda}
          </option>
        ))}
      </Select>
      <Button colorScheme="orange" onClick={handleReadyUp}>
        Ready Up
      </Button>
      {message && (
        <Alert status="info">
          <AlertIcon />
          {message}
        </Alert>
      )}
      <Button variant="link" onClick={() => setCurrentView('home')}>
        Back to Home
      </Button>
    </VStack>
  );
};

export default ReadyUp;
