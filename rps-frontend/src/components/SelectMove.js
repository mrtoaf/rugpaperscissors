// src/components/SelectMove.js
import React, { useState, useEffect } from 'react';
import { program, provider, web3, BN } from '../anchor';
import { Button, VStack, Text, Select, Input, Alert, AlertIcon } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';

const GAME_SEED = "game";

const SelectMove = ({ setCurrentView }) => {
  const [gamePdas, setGamePdas] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [originalMove, setOriginalMove] = useState('0'); // 0=Rock, 1=Paper, 2=Scissors
  const [salt, setSalt] = useState('');
  const [message, setMessage] = useState('');

  // Fetch games the user is part of
  const fetchUserGames = async () => {
    try {
      const gameAccounts = await program.account.gameState.all([
        // Potential filters can be added here
      ]);

      // Filter games where the user is the creator or the joiner
      const userGames = gameAccounts.filter(game => 
        game.account.creator.toBase58() === provider.wallet.publicKey.toBase58() ||
        (game.account.opponent && game.account.opponent.toBase58() === provider.wallet.publicKey.toBase58())
      );

      setGamePdas(userGames.map(game => game.publicKey.toBase58()));
    } catch (error) {
      console.error(error);
      setMessage(`Error fetching user games: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserGames();
  }, []);

  const handleSelectMove = async () => {
    try {
      if (!selectedGame) {
        setMessage("Please select a game.");
        return;
      }

      if (!salt) {
        setMessage("Please enter a salt.");
        return;
      }

      const moveNumber = parseInt(originalMove);
      if (![0, 1, 2].includes(moveNumber)) {
        setMessage("Invalid move selected.");
        return;
      }

      // Send transaction to select_move
      await program.rpc.selectMove(
        new BN(moveNumber),
        salt,
        {
          accounts: {
            gameAccount: new PublicKey(selectedGame),
            player: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          },
          signers: [],
        }
      );

      setMessage(`Move selected successfully for game PDA: ${selectedGame}`);
      setCurrentView('home');
    } catch (error) {
      console.error(error);
      setMessage(`Error selecting move: ${error.message}`);
    }
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="lg">Select Your Move</Text>
      <Select placeholder="Select a Game" onChange={(e) => setSelectedGame(e.target.value)}>
        {gamePdas.map((pda) => (
          <option key={pda} value={pda}>
            {pda}
          </option>
        ))}
      </Select>
      <Select value={originalMove} onChange={(e) => setOriginalMove(e.target.value)}>
        <option value="0">Rock</option>
        <option value="1">Paper</option>
        <option value="2">Scissors</option>
      </Select>
      <Input
        placeholder="Salt"
        value={salt}
        onChange={(e) => setSalt(e.target.value)}
      />
      <Button colorScheme="purple" onClick={handleSelectMove}>
        Submit Move
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

export default SelectMove;
