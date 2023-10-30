import useALICE from '../../contexts/ALICE/useALICE.ts';
import useCreateAction from '../../contexts/CreateAction/useCreateAction.ts';
import { useMemo } from 'react';
import { FadeIn } from '../../animations';
import AmountInput from '../../components/Common/AmountInput.tsx';
import Modal from '../../components/Common/Modal.tsx';
import useLPToken from '../../contexts/LPToken/useLPToken.ts';
import useBonALICE from '../../contexts/BonALICE/useBonALICE.ts';
import useUserProfile from '../../contexts/UserProfile/useUserProfile.ts';
import { getCurrentChainId } from '../../constants/chains.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Lottie from 'lottie-react';
import waitingForApproveAnimation from '../../../public/assets/animations/waiting-for-approve.json';
import InsufficientNFTAmoutModalBody from '../../components/Common/InsufficientNFTAmoutModalBody.tsx';
import ClaimedRewardModal from '../ClaimPrize/ClaimedRewardModal.tsx';
import BoostingAmountInput from '../../components/Common/BoostingAmountInput.tsx';
import { w3bNumberFromBigint, w3bNumberFromNumber } from '../../utils/web3.ts';
import { useBooster } from '../../hooks/booster/useBooster.ts';
import { useTokenPrice } from '../../hooks/tokenPrice/useTokenPrice.ts';
import CreateAmountCalculation from './CreateAmountCalculation.tsx';
import strings from '../../constants/strings.ts';

export const RenderCreateBody = () => {
  const { ALICEBalance } = useALICE();
  const {
    ALICEAllowanceForBooster,
    ALICEAllowance,
    LPTokenAllowanceForBooster,
  } = useBonALICE();
  const { LPTokenBalance } = useLPToken();
  const {
    createAmount,
    createBoostAmount,
    handleCreateAmountChange,
    handleCreateBoostAmountChange,
    handleCreateBonALICEClicked,
    createActionLoading,
    handleApproveALICEClicked,
    handleApproveALICEForBoosterClicked,
    handleApproveLPTokenClicked,
    isAllowanceModalOpen,
    closeAllowanceModal,
    isMetamaskLoading,
    isTransactionLoading,
    isApproveMetamaskLoading,
    isApproveTransactionLoading,
    isInsufficientModalOpen,
    setIsInsufficientModalOpen,
    isSufficientModalOpen,
    setIsSufficientModalOpen,
  } = useCreateAction();

  const { chainId, handleSwitchNetwork } = useUserProfile();
  const { boostCoefficient } = useBooster();
  const { ALICEPrice } = useTokenPrice();

  const maxAmountToBoost = useMemo(() => {
    return ALICEPrice
      ? w3bNumberFromBigint(
          (createAmount.big * w3bNumberFromNumber(ALICEPrice).big) /
            BigInt(10 ** 18),
        )
      : w3bNumberFromNumber(0);
  }, [createAmount, ALICEPrice]);

  const isCreateBondedALICEButtonDisabled = useMemo(() => {
    return (
      createAmount.dsp + 2 * createBoostAmount.dsp === 0 ||
      !ALICEAllowanceForBooster ||
      (!LPTokenAllowanceForBooster && createBoostAmount.big > BigInt(0)) ||
      !(createAmount || createBoostAmount) ||
      !(createAmount.big || createBoostAmount.big) ||
      (!ALICEBalance?.dsp && !LPTokenBalance?.dsp) ||
      (LPTokenBalance && LPTokenBalance.dsp < createBoostAmount.dsp) ||
      (ALICEBalance && ALICEBalance.dsp < createAmount.dsp) ||
      createActionLoading ||
      (createBoostAmount.dsp > 0 &&
        ALICEPrice !== undefined &&
        createBoostAmount.big > maxAmountToBoost.big)
    );
  }, [
    createAmount,
    createBoostAmount,
    ALICEAllowanceForBooster,
    LPTokenAllowanceForBooster,
    ALICEBalance,
    LPTokenBalance,
    createActionLoading,
    ALICEPrice,
    maxAmountToBoost.big,
  ]);

  return (
    <>
      <FadeIn duration={0.1} delay={0.1}>
        <AmountInput
          rightText={strings.token}
          balance={ALICEBalance}
          value={createAmount}
          withLink
          onValueChanged={handleCreateAmountChange}
        />
      </FadeIn>

      <FadeIn className="mb-4" duration={0.1} delay={0.1}>
        <BoostingAmountInput
          withLink
          rightText={'USDC'}
          balance={LPTokenBalance}
          value={createBoostAmount}
          boostCoefficient={boostCoefficient}
          max={maxAmountToBoost}
          onValueChanged={handleCreateBoostAmountChange}
          disabled={!maxAmountToBoost || maxAmountToBoost.big === BigInt(0)}
        />
      </FadeIn>

      <CreateAmountCalculation />
      <FadeIn
        duration={0.1}
        delay={0.1}
        className="mt-auto max-md:mt-10 max-md:w-[80vw] md:mx-auto !w-full"
      >
        {(ALICEBalance && createAmount.dsp > ALICEBalance.dsp) ||
        (LPTokenBalance && createBoostAmount.dsp > LPTokenBalance.dsp) ? (
          <button
            className="btn btn--white min-w-[360px] mx-auto !py-4"
            disabled
          >
            Insufficient Funds
          </button>
        ) : chainId !== getCurrentChainId() ? (
          <button
            onClick={() => handleSwitchNetwork(getCurrentChainId())}
            className="btn btn--white min-w-[360px] mx-auto !py-4"
          >
            Switch Network
          </button>
        ) : isMetamaskLoading || isTransactionLoading ? (
          <button
            className="btn btn--white min-w-[360px] mx-auto !py-4"
            disabled
          >
            {isMetamaskLoading
              ? 'Waiting for Metamask...'
              : 'Waiting for Tx...'}
          </button>
        ) : createBoostAmount.dsp > 0 &&
          ALICEAllowanceForBooster &&
          ALICEAllowanceForBooster.big < createAmount.big ? (
          <button
            onClick={() => handleApproveALICEForBoosterClicked()}
            className="btn btn--white min-w-[360px] mx-auto !py-4"
            disabled={isCreateBondedALICEButtonDisabled}
          >
            Approve{' '}
            {ALICEBalance && createAmount.big < ALICEBalance.big
              ? createAmount.hStr + ' ' + strings.token
              : 'All ' + strings.tokens}
          </button>
        ) : createBoostAmount.dsp === 0 &&
          ALICEAllowance &&
          ALICEAllowance.big < createAmount.big ? (
          <button
            onClick={() => handleApproveALICEClicked()}
            className="btn btn--white min-w-[360px] mx-auto !py-4"
            disabled={isCreateBondedALICEButtonDisabled}
          >
            Approve{' '}
            {ALICEBalance && createAmount.big < ALICEBalance.big
              ? createAmount.hStr + ' ' + strings.token
              : 'All ' + strings.token}
          </button>
        ) : LPTokenAllowanceForBooster &&
          LPTokenAllowanceForBooster.big < createBoostAmount.big ? (
          <button
            onClick={() => handleApproveLPTokenClicked()}
            className="btn btn--white min-w-[360px] mx-auto !py-4"
            disabled={isCreateBondedALICEButtonDisabled}
          >
            Approve{' '}
            {LPTokenBalance && createBoostAmount.big < LPTokenBalance.big
              ? createBoostAmount.hStr + ' USDC'
              : 'All USDC'}
          </button>
        ) : (
          <button
            onClick={() => handleCreateBonALICEClicked()}
            className="btn btn--white min-w-[360px] mx-auto !py-4"
            disabled={isCreateBondedALICEButtonDisabled}
          >
            Create Bonded {strings.token}
          </button>
        )}
      </FadeIn>
      <Modal
        size="sm"
        isOpen={isInsufficientModalOpen}
        closeModalHandler={() => setIsInsufficientModalOpen(false)}
      >
        <InsufficientNFTAmoutModalBody operation="created" />
      </Modal>
      <Modal
        size="sm"
        isOpen={isSufficientModalOpen}
        closeModalHandler={() => setIsSufficientModalOpen(false)}
      >
        <ClaimedRewardModal operation="created" />
      </Modal>
      <Modal
        size="sm"
        isOpen={isAllowanceModalOpen}
        closeModalHandler={closeAllowanceModal}
      >
        <div className="flex flex-col justify-center items-center">
          <Lottie
            animationData={waitingForApproveAnimation}
            className={`w-60 h-auto`}
          />
          <p className="text-center text-black mb-6 font-medium">
            Please approve by signing the message that appears in your wallet.
            This allows the smart contract to securely lock your{' '}
            {createBoostAmount.dsp > 0 &&
            ALICEAllowanceForBooster &&
            ALICEAllowanceForBooster.big < createAmount.big
              ? strings.token + ' '
              : createBoostAmount.dsp === 0 &&
                ALICEAllowance &&
                ALICEAllowance.big < createAmount.big
              ? strings.token + ' '
              : LPTokenAllowanceForBooster &&
                LPTokenAllowanceForBooster.big < createBoostAmount.big
              ? 'USDC '
              : ''}
            tokens in the{' '}
            {createBoostAmount && createBoostAmount.dsp > 0
              ? 'Booster contract'
              : strings.nft + ' contract'}
            .
          </p>
          {ALICEAllowanceForBooster &&
          ALICEAllowanceForBooster?.big < createAmount?.big ? (
            <button
              className="btn btn--primary"
              onClick={() =>
                !isApproveMetamaskLoading &&
                !isApproveTransactionLoading &&
                handleApproveALICEClicked()
              }
            >
              {isApproveMetamaskLoading
                ? 'Waiting for Metamask...'
                : isApproveTransactionLoading
                ? 'Waiting for Tx...'
                : 'Approve'}
            </button>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() =>
                !isApproveMetamaskLoading &&
                !isApproveTransactionLoading &&
                handleApproveLPTokenClicked()
              }
            >
              {isApproveMetamaskLoading
                ? 'Waiting for Metamask...'
                : isApproveTransactionLoading
                ? 'Waiting for Tx...'
                : 'Approve'}
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};
