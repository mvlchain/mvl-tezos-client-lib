import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit, TransferParams } from "@taquito/taquito";
import { tzip12, Tzip12Module } from "@taquito/tzip12";
import Decimal from "decimal.js";
import { injectable } from "tsyringe";

import { Network, getNetworkConfig } from "../constants/network.constant";
import { loadingFunction } from "../utils/loadingHelper";

import {
  ITezosContractTransferParam,
  ITezosData,
  ITransactionServiceTezos,
} from "./TransactionServiceTezos.type";
@injectable()
export class TransactionServiceTezos implements ITransactionServiceTezos {
  constructor() {}

  sendTransaction = loadingFunction<string>(
    async (
      selectedNetwork: Network,
      selectedWalletPrivateKey: string,
      params: TransferParams
    ) => {
      const network = getNetworkConfig(selectedNetwork);
      const Tezos = new TezosToolkit(network.rpcUrl);
      Tezos.setProvider({
        signer: new InMemorySigner(selectedWalletPrivateKey),
      });

      const op = await Tezos.wallet
        .transfer({
          ...params,
        })
        .send();
      return op.opHash;
    }
  );

  sendContractTransaction = loadingFunction<string>(
    async (
      selectedNetwork: Network,
      selectedWalletPrivateKey: string,
      params: ITezosContractTransferParam
    ) => {
      const network = getNetworkConfig(selectedNetwork);
      const Tezos = new TezosToolkit(network.rpcUrl);
      Tezos.setProvider({
        signer: new InMemorySigner(selectedWalletPrivateKey),
      });
      Tezos.addExtension(new Tzip12Module());
      const fa1_2TokenContract = await Tezos.wallet.at(params.to, tzip12);

      const metadata = await fa1_2TokenContract.tzip12().getTokenMetadata(0);
      const decimals = metadata.decimals;
      const data: ITezosData = JSON.parse(params.data);
      const amount = new Decimal(data.value)
        .mul(Decimal.pow(10, decimals))
        .toFixed();
      const op = await fa1_2TokenContract.methods
        .transfer(data.from, data.to, amount)
        .send();
      await op.confirmation();
      return op.opHash;
    }
  );

  sendContractTransactionFa2 = loadingFunction<string>(
    async (
      selectedNetwork: Network,
      selectedWalletPrivateKey: string,
      params: ITezosContractTransferParam
    ) => {
      const network = getNetworkConfig(selectedNetwork);
      const Tezos = new TezosToolkit(network.rpcUrl);
      Tezos.setProvider({
        signer: new InMemorySigner(selectedWalletPrivateKey),
      });
      Tezos.addExtension(new Tzip12Module());
      const fa2TokenContract = await Tezos.wallet.at(params.to, tzip12);

      const metadata = await fa2TokenContract.tzip12().getTokenMetadata(0);
      const tokenId = metadata.token_id;
      const decimals = metadata.decimals;
      const data: ITezosData = JSON.parse(params.data);
      const amount = new Decimal(data.value)
        .mul(Decimal.pow(10, decimals))
        .toFixed();
      const op = await fa2TokenContract.methods
        .transfer([
          {
            from_: data.from,
            txs: [{ to_: data.to, token_id: tokenId, amount: amount }],
          },
        ])
        .send();
      await op.confirmation();
      return op.opHash;
    }
  );
}
