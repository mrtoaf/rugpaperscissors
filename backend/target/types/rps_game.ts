/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rps_game.json`.
 */
export type RpsGame = {
  "address": "4yCtf1y6Wpsfpxt62Xbc5cWRpx7veikVDQbYkJQEzM7U",
  "metadata": {
    "name": "rpsGame",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "gameAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "wager"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "wager",
          "type": "u64"
        }
      ]
    },
    {
      "name": "joinGame",
      "discriminator": [
        107,
        112,
        18,
        38,
        56,
        173,
        60,
        128
      ],
      "accounts": [
        {
          "name": "gameAccount",
          "writable": true
        },
        {
          "name": "joiner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "readyUp",
      "discriminator": [
        231,
        67,
        5,
        187,
        85,
        228,
        222,
        234
      ],
      "accounts": [
        {
          "name": "gameAccount",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "selectMove",
      "discriminator": [
        195,
        184,
        242,
        114,
        216,
        199,
        33,
        182
      ],
      "accounts": [
        {
          "name": "gameAccount",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "originalMove",
          "type": "u8"
        },
        {
          "name": "salt",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "discriminator": [
        144,
        94,
        208,
        172,
        248,
        99,
        134,
        120
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "gameNotOpen",
      "msg": "The game is not open for joining."
    },
    {
      "code": 6001,
      "name": "moveNotSelected",
      "msg": "The player has not selected a move."
    },
    {
      "code": 6002,
      "name": "unauthorized",
      "msg": "Unauthorized action."
    },
    {
      "code": 6003,
      "name": "gameAlreadyEnded",
      "msg": "Game has already ended."
    }
  ],
  "types": [
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "opponent",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "creatorMoveHashed",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "joinerMoveHashed",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "creatorReady",
            "type": "bool"
          },
          {
            "name": "joinerReady",
            "type": "bool"
          },
          {
            "name": "wager",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "gameStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "committed"
          },
          {
            "name": "ended"
          }
        ]
      }
    }
  ]
};
