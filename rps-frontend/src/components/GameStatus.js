// src/components/GameStatus.js
import React, { useState, useEffect } from 'react';
import { program, provider, web3, BN } from '../anchor';
import { Button, VStack, Text, Input, Alert, AlertIcon, Select } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';

const GAME_SEED = "game";

const GameStatus = ({ setCurrentView }) => {
  const [gamePdas, setGamePdas] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [status, setStatus] = useState(null);
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

  const fetchStatus = async () => {
    try {
      if (!selectedGame) {
        setMessage("Please select a game.");
        return;
      }

      // Fetch account data
      const gameAccountData = await program.account.gameState.fetch(new PublicKey(selectedGame));

      setStatus(gameAccountData);
      setMessage(`Fetched game status successfully!`);
    } catch (error) {
      console.error(error);
      setMessage(`Error fetching status: ${error.message}`);
    }
  };

  const displayStatus = () => {
    if (!status) return null;

    let statusText = '';
    if (status.status === 'Open') statusText = 'Open';
    else if (status.status === 'Committed') statusText = 'Committed';
    else if (status.status === 'Ended') statusText = 'Ended';

    return (
      <VStack spacing={2} mt={4} align="start">
        <Text><strong>Creator:</strong> {status.creator.toBase58()}</Text>
        <Text><strong>Opponent:</strong> {status.opponent ? status.opponent.toBase58() : "Not Joined"}</Text>
        <Text><strong>Wager:</strong> {status.wager.toNumber() / web3.LAMPORTS_PER_SOL} SOL</Text>
        <Text><strong>Status:</strong> {statusText}</Text>
        <Text><strong>Creator Ready:</strong> {status.creatorReady ? "Yes" : "No"}</Text>
        <Text><strong>Joiner Ready:</strong> {status.joinerReady ? "Yes" : "No"}</Text>
      </VStack>
    );
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="lg">Game Status</Text>
      <Select placeholder="Select a Game" onChange={(e) => setSelectedGame(e.target.value)}>
        {gamePdas.map((pda) => (
          <option key={pda} value={pda}>
            {pda}
          </option>
        ))}
      </Select>
      <Button colorScheme="teal" onClick={fetchStatus}>
        Fetch Status
      </Button>
      {message && (
        <Alert status="info">
          <AlertIcon />
          {message}
        </Alert>
      )}
      {displayStatus()}
      <Button variant="link" onClick={() => setCurrentView('home')}>
        Back to Home
      </Button>
    </VStack>
  );
};

export default GameStatus;
