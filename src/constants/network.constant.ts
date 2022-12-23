import { valueOf } from "../utils/types";

export const NETWORK = {
  TEZOS: "TEZOS",
  TEZOS_GHOSTNET: "TEZOS_GHOSTNET",
} as const;

export type Network = valueOf<typeof NETWORK>;

export const NETWORK_ID = {
  XTZ: "XTZ",
} as const;

export type NetworkId = valueOf<typeof NETWORK_ID>;

export const NETWORK_FEE_TYPE = {
  TEZOS: "TEZOS",
} as const;

export type NetworkFeeType = valueOf<typeof NETWORK_FEE_TYPE>;

export type NetworkConfig = {
  name: string;
  shortName: string;
  chainId: number;
  bip44: number;
  rpcUrl: string;
  networkFeeType: NetworkFeeType;
  networkId: NetworkId;
  coin: string;
};

const NETWORK_CONFIGS: Record<Network, NetworkConfig> = {
  [NETWORK.TEZOS]: {
    name: "Tezos Mainnet",
    shortName: "Tezos",
    chainId: 1729,
    bip44: 1729,
    rpcUrl: "https://mainnet-node.madfish.solutions/",
    networkFeeType: NETWORK_FEE_TYPE.TEZOS,
    networkId: NETWORK_ID.XTZ,
    coin: "XTZ",
  },
  [NETWORK.TEZOS_GHOSTNET]: {
    name: "Tezos Ghostnet",
    shortName: "Tezos Ghostnet",
    chainId: 1729,
    bip44: 1729,
    rpcUrl: "https://ghostnet.smartpy.io/",
    networkFeeType: NETWORK_FEE_TYPE.TEZOS,
    networkId: NETWORK_ID.XTZ,
    coin: "XTZ",
  },
};

const baseNetwork = (() => {
  if (process.env.NODE_ENV === "production") {
    return "mainnet";
  } else {
    return "testnet";
  }
})();

export const networkIdToNetworkByBase = (networkId: NetworkId): Network => {
  let network: Network;
  switch (networkId) {
    case NETWORK_ID.XTZ:
      network = NETWORK.TEZOS;
      break;
  }
  return getNetworkByBase(network);
};

export const getNetworkByBase = (network: Network): Network => {
  let networkByBase: Network = network;
  const isMainnet = baseNetwork === "mainnet";
  if (!isMainnet) {
    switch (network) {
      case NETWORK.TEZOS:
        networkByBase = NETWORK.TEZOS_GHOSTNET;
        break;
      default:
        networkByBase = NETWORK.TEZOS_GHOSTNET;
    }
  }
  return networkByBase;
};

export const getNetworkConfig = (network: Network): NetworkConfig =>
  NETWORK_CONFIGS[network];

export const EXPLORER_BASE_URL: Record<Network, string> = {
  [NETWORK.TEZOS]: "https://tzkt.io/",
  [NETWORK.TEZOS_GHOSTNET]: "https://ghostnet.tzkt.io/",
};
