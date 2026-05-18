const alchemyRpc = import.meta.env.VITE_ALCHEMY_LENS_RPC;

export const RPCS = [
  "https://rpc.lens.xyz",
  "https://api.lens.matterhosted.dev",
  ...(alchemyRpc ? [alchemyRpc] : [])
];
