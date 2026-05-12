import { signMessage } from '@wagmi/core';
import { config } from '../web3/config';

export async function submitScoreOnChain(address: string, score: number) {
  try {
    const message = `Animal Quiz\nSave High Score: ${score}\nWallet: ${address}\nTimestamp: ${Date.now()}`;
    const signature = await signMessage(config, { 
      message, 
      account: address as `0x${string}` 
    });
    console.log("SIWE Signature for score:", signature);
    return signature;
  } catch (error) {
    console.error("Failed to sign SIWE message", error);
    throw error;
  }
}
