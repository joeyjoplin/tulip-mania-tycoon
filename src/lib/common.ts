/**
 * @license
 * Copyright (c) 2024 Tyler van der Hoeven
 * MIT License
 * Modified by Daniele Rodrigues dos Santos - removed Buffer
 */

import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Account, Keypair, StrKey } from "@stellar/stellar-sdk/minimal";
import { basicNodeSigner } from "@stellar/stellar-sdk/minimal/contract";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";
import { Buffer } from "buffer"; // ✅ Polyfill for Buffer in the browser

// Ensure Buffer is available globally (required for browser builds)
if (typeof window !== "undefined" && !(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

// Initialize Stellar RPC server
export const rpc = new Server(import.meta.env.VITE_rpcUrl);

// Mock public key and source account
export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32));
export const mockSource = new Account(mockPubkey, "0");

// Generate a deterministic keypair based on the current hour
// and request an airdrop if the account doesn't exist
export const fundKeypair = new Promise<Keypair>(async (resolve) => {
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const nowData = new TextEncoder().encode(now.getTime().toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", nowData);
  const keypair = Keypair.fromRawEd25519Seed(Buffer.from(hashBuffer));
  const publicKey = keypair.publicKey();

  rpc
    .getAccount(publicKey)
    .catch(() => rpc.requestAirdrop(publicKey))
    .catch(() => {});

  resolve(keypair);
});

// Derive signer and public key from the generated keypair
export const fundPubkey = (await fundKeypair).publicKey();
export const fundSigner = basicNodeSigner(
  await fundKeypair,
  import.meta.env.VITE_networkPassphrase
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
