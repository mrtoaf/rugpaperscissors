// src/components/CreateGame.js
import React, { useState } from 'react';
import { program, provider, web3, BN } from '../anchor';
import { Button, Input, VStack, Text, Alert, AlertIcon } from '@chakra-ui/react';

const GAME_SEED = "game";

const CreateGame = ({ setCurrentView }) => {
  const [wager, setWager] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateGame = async () => {
    try {
      if (!wager || isNaN(wager) || parseFloat(wager) <= 0) {
        setMessage("Please enter a valid wager amount.");
        return;
      }

      const wagerLamports = parseFloat(wager) * web3.LAMPORTS_PER_SOL; // Convert SOL to lamports

      // Find PDA
      const [gameAccountPda, bump] = await web3.PublicKey.findProgramAddress(
        [Buffer.from(GAME_SEED), provider.wallet.publicKey.toBuffer(), new BN(wagerLamports).toArrayLike(Buffer, 'le', 8)],
        program.programId
      );

      // Send transaction to create_game
      await program.rpc.createGame(new BN(wagerLamports), {
        accounts: {
          gameAccount: gameAccountPda,
          creator: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [],
      });

      setMessage(`Game created successfully! Game PDA: ${gameAccountPda.toBase58()}`);
      setCurrentView('home');
    } catch (error) {
      console.error(error);
      setMessage(`Error creating game: ${error.message}`);
    }
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="lg">Create a New Game</Text>
      <Input
        placeholder="Wager (SOL)"
        value={wager}
        onChange={(e) => setWager(e.target.value)}
        type="number"
        min="0.1"
        step="0.1"
      />
      <Button colorScheme="teal" onClick={handleCreateGame}>
        Create Game
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

export default CreateGame;
