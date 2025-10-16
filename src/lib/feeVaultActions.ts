// src/lib/feeVaultActions.ts
import { server, account } from "@/lib/common";
import { FeeVaultClient } from "./feeVaultClient";

type CommonArgs = {
  feeVaultId: string;      // contrato FeeVault
  reserveId: string;       // reserve suportado
  userContractId: string;  // wallet do usuário (contractId da Passkey wallet)
  signerKeyId: string;     // keyId (sp:keyId) para account.sign
};

export async function fvDeposit(args: CommonArgs & { amount: bigint }) {
  const { feeVaultId, reserveId, userContractId, amount, signerKeyId } = args;
  const fv = new FeeVaultClient(feeVaultId);

  // Se o handler do token exigir allowance, faça antes:
  // await tokenClient.increase_allowance({ owner: userContractId, spender: feeVaultId, amount });
  // e assine auth entries desta chamada (ex.: via transfer.signAuthEntries).
  // Como varia por asset/handler, mantemos fora daqui.

  const at = await account.build([fv.depositOp({ reserve: reserveId, user: userContractId, amount })]);
  await account.sign(at, { keyId: signerKeyId });

  const res = await server.send(at.built!);
  return res;
}

export async function fvWithdraw(args: CommonArgs & { amount: bigint }) {
  const { feeVaultId, reserveId, userContractId, amount, signerKeyId } = args;
  const fv = new FeeVaultClient(feeVaultId);

  const at = await account.build([fv.withdrawOp({ reserve: reserveId, user: userContractId, amount })]);
  await account.sign(at, { keyId: signerKeyId });

  const res = await server.send(at.built!);
  return res;
}

export async function fvGetUnderlying(args: Omit<CommonArgs, "signerKeyId">) {
  const { feeVaultId, reserveId, userContractId } = args;
  const fv = new FeeVaultClient(feeVaultId);

  // Simular para ler o retorno (i128). Se teu helper tiver server.simulate, use.
  const simTx = await account.build([fv.getUnderlyingOp({ reserve: reserveId, user: userContractId })], {
    simulateOnly: true,
  });

  const sim = await server.simulate(simTx.built!);
  // Dependendo do teu wrapper de simulate, você terá o retorno como ScVal.
  // Abaixo é um exemplo genérico — ajuste se teu server.simulate já decodificar:
  const resVal = (sim as any)?.result?.ret ?? (sim as any)?.results?.[0]?.retval;
  // Converta ScVal i128 -> bigint (ajuste conforme utilitários existentes no teu projeto)
  const toBigInt = (sv: any) => {
    if (!sv) return 0n;
    // Quando vem como string já normalizado
    if (typeof sv === "string") return BigInt(sv);
    // Quando vem como partes hi/lo (adapte se seu simulate retornar assim):
    const hi = BigInt(sv?.i128?.hi ?? 0);
    const lo = BigInt(sv?.i128?.lo ?? 0);
    return (hi << 64n) + lo;
  };

  return toBigInt(resVal);
}
