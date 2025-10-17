/**
 * @license
 * Copyright (c) 2024 Tyler van der Hoeven
 * MIT License
 * Modified by Daniele Rodrigues dos Santos - optimized to build on Vercel
 */


import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Account, Keypair } from "@stellar/stellar-sdk/minimal";
import { basicNodeSigner } from "@stellar/stellar-sdk/minimal/contract";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";

// Initialize Stellar RPC server
export const rpc = new Server(import.meta.env.VITE_rpcUrl);

// Create a deterministic mock keypair from an all-zero seed (DO NOT use in production)
const zeroSeed = new Uint8Array(32);
const mockKeypair = Keypair.fromRawEd25519Seed(zeroSeed);

// Mock public key and source account (sequence starts at "0")
export const mockPubkey = mockKeypair.publicKey();
export const mockSource = new Account(mockPubkey, "0");

// Helper: derive a deterministic seed from current hour using Web Crypto
async function hourlySeed(): Promise<Uint8Array> {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const nowData = new TextEncoder().encode(now.getTime().toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", nowData);
  return new Uint8Array(hashBuffer);
}

// Create a keypair, ensure it exists (request airdrop if missing), and return it
async function createFundKeypair(): Promise<Keypair> {
  const seed = await hourlySeed();
  const keypair = Keypair.fromRawEd25519Seed(seed);
  const publicKey = keypair.publicKey();

  // Best-effort: fetch account; if not found, request airdrop; ignore errors
  await rpc.getAccount(publicKey).catch(() => rpc.requestAirdrop(publicKey).catch(() => {}));

  return keypair;
}

// Export Promises instead of using top-level await (compatible with Vercel/esbuild targets)
export const fundKeypairPromise: Promise<Keypair> = createFundKeypair();

export const fundPubkeyPromise: Promise<string> = fundKeypairPromise.then((kp) => kp.publicKey());

export const fundSignerPromise = fundKeypairPromise.then((kp) =>
  basicNodeSigner(kp, import.meta.env.VITE_networkPassphrase)
);

// Initialize PasskeyKit client
export const account = new PasskeyKit({
  rpcUrl: import.meta.env.VITE_rpcUrl,
  networkPassphrase: import.meta.env.VITE_networkPassphrase,
  walletWasmHash: import.meta.env.VITE_walletWasmHash,
});

// Initialize PasskeyServer instance
export const server = new PasskeyServer({
  rpcUrl: import.meta.env.VITE_rpcUrl,
  launchtubeUrl: import.meta.env.VITE_launchtubeUrl,
  launchtubeJwt: import.meta.env.VITE_launchtubeJwt,
  mercuryProjectName: import.meta.env.VITE_mercuryProjectName,
  mercuryUrl: import.meta.env.VITE_mercuryUrl,
  mercuryJwt: import.meta.env.VITE_mercuryJwt,
});

// Initialize Stellar Asset Contract (SAC) client
export const sac = new SACClient({
  rpcUrl: import.meta.env.VITE_rpcUrl,
  networkPassphrase: import.meta.env.VITE_networkPassphrase,
});

// Retrieve native asset client (usually the base XLM contract)
export const native = sac.getSACClient(import.meta.env.VITE_nativeContractId);


