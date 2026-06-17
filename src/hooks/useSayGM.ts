import { useAccount, useSendTransaction, useSendCalls, useWaitForCallsStatus, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useWalletCapabilities } from './useWalletCapabilities';
import { BUILDER_CODE, logAttributedAction } from '../lib/erc8021';
import { base } from 'wagmi/chains';

// Pre-computed data suffix for "bc_pztj2h8z"
const BUILDER_DATA_SUFFIX = "0x0b62635f707a746a3268387a0080218021802180218021802180218021";
const GM_ADDRESS = '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7';

export function useSayGM() {
  const { isConnected } = useAccount();
  const { supportsBatching } = useWalletCapabilities();
  
  const { sendCalls, isPending: isBatchPending } = useSendCalls();
  const { sendTransaction, isPending: isTxPending } = useSendTransaction();

  const isPending = supportsBatching ? isBatchPending : isTxPending;

  const handleSayGM = (context: string) => {
    if (!isConnected) return alert('Please connect wallet first.');
    logAttributedAction(context);

    if (supportsBatching) {
      sendCalls({
        calls: [
          { to: GM_ADDRESS, data: '0x', value: parseEther('0') },
        ],
        capabilities: {
          dataSuffix: {
            value: BUILDER_DATA_SUFFIX,
            optional: true
          }
        },
        chainId: base.id
      });
    } else {
      sendTransaction({
        to: GM_ADDRESS,
        value: parseEther('0'),
        data: BUILDER_DATA_SUFFIX as `0x${string}`
      }, {
        onSuccess: () => alert('GM Said on-chain!'),
        onError: (e) => console.log('Transaction rejected', e)
      });
    }
  };

  return { handleSayGM, isPending };
}
