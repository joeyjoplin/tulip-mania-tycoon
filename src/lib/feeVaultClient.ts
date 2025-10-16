// src/lib/feeVaultClient.ts
import { Address, Contract, xdr } from "@stellar/stellar-sdk/minimal";

export class FeeVaultClient {
  constructor(public readonly feeVaultId: string) {}

  private c() {
    return new Contract(this.feeVaultId);
  }

  // i128 helper
  private i128(n: bigint) {
    return xdr.ScVal.scvI128(xdr.Int128Parts.fromString(n.toString()));
  }

  // deposit(reserve: Address, user: Address, amount: i128) -> i128
  depositOp(args: { reserve: string; user: string; amount: bigint }) {
    const { reserve, user, amount } = args;
    return this.c().call(
      "deposit",
      Address.fromString(reserve),
      Address.fromString(user),
      this.i128(amount)
    );
  }

  // withdraw(reserve: Address, user: Address, amount: i128) -> i128
  withdrawOp(args: { reserve: string; user: string; amount: bigint }) {
    const { reserve, user, amount } = args;
    return this.c().call(
      "withdraw",
      Address.fromString(reserve),
      Address.fromString(user),
      this.i128(amount)
    );
  }

  // get_underlying_tokens(reserve: Address, user: Address) -> i128
  getUnderlyingOp(args: { reserve: string; user: string }) {
    const { reserve, user } = args;
    return this.c().call(
      "get_underlying_tokens",
      Address.fromString(reserve),
      Address.fromString(user)
    );
  }
}
