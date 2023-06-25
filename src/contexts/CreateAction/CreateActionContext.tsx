import { createContext, ReactNode, useEffect, useState } from 'react';
import useALICE from '../ALICE/useALICE.ts';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import BONALICE_API from '../../abis/BonALICE.json';
import ALICE_API from '../../abis/ALICE.json';
import { BONALICE_ADDRESS, ALICE_ADDRESS } from '../../constants/addresses.ts';
import { getCurrentChainId } from '../../constants/chains.ts';
import useUserProfile from '../UserProfile/useUserProfile.ts';
import { W3bNumber } from '../../types/wagmi.ts';
import { w3bNumberFromString } from '../../utils/web3.ts';
import { TransactionSources } from '../../types';
import useTransactions from '../Transactions/useTransactions.ts';

const CreateActionContext = createContext<{
  createAmount: W3bNumber;
  createActionLoading: boolean;
  handleCreateAmountChange: (amount: string) => void;
  handleCreateBonALICEClicked: () => void;
  handleApproveALICEClicked: () => void;
  isAllowanceModalOpen: boolean;
  closeAllowanceModal: () => void;
  approveLoading: boolean;
}>({
  createAmount: {
    dsp: 0,
    big: BigInt(0),
    hStr: '',
  },
  createActionLoading: false,
  handleCreateAmountChange: () => {},
  handleCreateBonALICEClicked: () => {},
  handleApproveALICEClicked: () => {},
  isAllowanceModalOpen: false,
  closeAllowanceModal: () => {},
  approveLoading: false,
});

const CreateActionProvider = ({ children }: { children: ReactNode }) => {
  const { ALICEBalance, allowance } = useALICE();
  const { walletAddress } = useUserProfile();
  const { addTransaction } = useTransactions();

  const [createActionLoading, setCreateActionLoading] = useState(false);
  const [createAmount, setCreateAmount] = useState<W3bNumber>({
    dsp: 0,
    big: BigInt(0),
    hStr: '',
  });

  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false);

  const handleCreateAmountChange = (amount: string) => {
    setCreateAmount(w3bNumberFromString(amount));
  };

  const { config: mintAndLockConfig } = usePrepareContractWrite({
    abi: BONALICE_API,
    address: BONALICE_ADDRESS[getCurrentChainId()],
    functionName: 'mintAndLock',
    args: [
      [ALICE_ADDRESS[getCurrentChainId()]],
      [createAmount.big],
      walletAddress,
    ],
    chainId: getCurrentChainId(),
  });

  const { write: mintAndLockWrite } = useContractWrite(mintAndLockConfig);

  const handleCreateBonALICEClicked = () => {
    if (
      !ALICEBalance ||
      !createAmount ||
      Number(createAmount) > Number(ALICEBalance.big)
    )
      return;
    setCreateActionLoading(true);
    mintAndLockWrite?.();
    setCreateActionLoading(false);
  };

  const { config: approveConfig } = usePrepareContractWrite({
    abi: ALICE_API,
    address: ALICE_ADDRESS[getCurrentChainId()],
    functionName: 'approve',
    args: [BONALICE_ADDRESS[getCurrentChainId()], createAmount.big],
    chainId: getCurrentChainId(),
  });

  const {
    write: approveWrite,
    isLoading: approveLoading,
    data: approveData,
    isSuccess: approveSuccess,
  } = useContractWrite(approveConfig);

  useEffect(() => {
    if (approveSuccess) closeAllowanceModal();
    console.log('----------', {
      id: Math.random(),
      hash: approveData?.hash,
      source: TransactionSources.ALLOWANCE,
    });
    if (approveData)
      addTransaction({
        id: Math.random(),
        hash: approveData.hash,
        source: TransactionSources.ALLOWANCE,
      });
  }, [approveData, approveSuccess, addTransaction]);

  const handleApproveALICEClicked = () => {
    if (
      !ALICEBalance ||
      !createAmount ||
      Number(createAmount) > Number(ALICEBalance.big)
    )
      return;
    openAllowanceModal();
    approveWrite?.();
  };

  useEffect(() => {
    console.log('allowance', allowance);
    console.log('createAmount', createAmount);
    if (
      allowance &&
      createAmount &&
      Number(createAmount.big) <= Number(allowance.big)
    )
      closeAllowanceModal();
  }, [allowance, createAmount]);

  const openAllowanceModal = () => setIsAllowanceModalOpen(true);
  const closeAllowanceModal = () => setIsAllowanceModalOpen(false);

  return (
    <CreateActionContext.Provider
      value={{
        createAmount,
        createActionLoading,
        handleCreateAmountChange,
        handleCreateBonALICEClicked,
        handleApproveALICEClicked,
        isAllowanceModalOpen,
        closeAllowanceModal,
        approveLoading,
      }}
    >
      {children}
    </CreateActionContext.Provider>
  );
};

export { CreateActionProvider, CreateActionContext };
