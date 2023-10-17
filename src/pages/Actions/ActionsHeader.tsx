import useActions from '../../contexts/Actions/useActions.ts';
import { ActionType } from '../../types';
import { FadeIn, Scale } from '../../animations';
import { AnimatePresence } from 'framer-motion';

import { useMuonNodeStaking } from '../../hooks/muonNodeStaking/useMuonNodeStaking.ts';

const ActionsHeader = () => {
  const { selectedAction } = useActions();
  const { muonNodeStakingUsers } = useMuonNodeStaking();

  return (
    <div className="actions-header flex items-center w-[700px] gap-9">
      <div className="w-[90px] flex items-center h-full">
        {renderActionImageAndName(selectedAction)}
      </div>
      <div className="w-full">
        <p className="text-center md:text-left md:text-lg font-light text-white md:min-h-[112px] flex items-center">
          {renderActionDescription(selectedAction)}
        </p>
      </div>

      {muonNodeStakingUsers && muonNodeStakingUsers[4] !== BigInt(0) && (
        <div
          className="ml-auto flex gap-1.5 items-center cursor-pointer"
          onClick={() => window.open('/dashboard/', '_self')}
        >
          <img src="/assets/images/actions/back-icon.svg" alt="" />
          <p className="font-medium text-sm underline ">Back to Dashboard</p>
        </div>
      )}
    </div>
  );
};

const renderActionImageAndName = (action: ActionType) => {
  return (
    <div className="w-[90px] flex flex-col justify-center items-center gap-2">
      <div className="action-image relative min-h-[32px] md:min-h-[54px] flex justify-center w-full">
        {renderActionImage(action)}
      </div>
      <div className="action-name text-primary-10-solid text-xl font-medium flex justify-center w-full text-center">
        {renderActionName(action)}
      </div>
    </div>
  );
};

const renderActionImage = (action: ActionType) => {
  return (
    <>
      <AnimatePresence>
        {action === ActionType.VIEW ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <img
              className="w-8 h-8 md:w-[52px] md:h-[52px]"
              src="/assets/images/actions/view-icon.svg"
              alt="view"
            />
          </Scale>
        ) : action === ActionType.CREATE ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <img
              className="w-8 h-8 md:w-[52px] md:h-[52px]"
              src="/assets/images/actions/create-icon.svg"
              alt="create"
            />
          </Scale>
        ) : action === ActionType.UPGRADE ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <img
              className="w-8 h-8 md:w-[52px] md:h-[52px]"
              src="/assets/images/actions/upgrade-icon.svg"
              alt="upgrade"
            />
          </Scale>
        ) : action === ActionType.MERGE ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <img
              className="w-8 h-8 md:w-[52px] md:h-[52px]"
              src="/assets/images/actions/merge-icon.svg"
              alt="merge"
            />
          </Scale>
        ) : action === ActionType.SPLIT ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <img
              className="w-8 h-8 md:w-[52px] md:h-[52px]"
              src="/assets/images/actions/split-icon.svg"
              alt="split"
            />
          </Scale>
        ) : action === ActionType.TRANSFER ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <img
              className="w-8 h-8 md:w-[52px] md:h-[52px]"
              src="/assets/images/actions/transfer-icon.svg"
              alt="transfer"
            />
          </Scale>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </>
  );
};

const renderActionDescription = (action: ActionType) => {
  return (
    <>
      {action === ActionType.VIEW ? (
        <FadeIn key={action} duration={0.1} delay={0.1}>
          <p>Here are all your bonPION NFTs.</p>
        </FadeIn>
      ) : action === ActionType.CREATE ? (
        <FadeIn key={action} duration={0.1} delay={0.1}>
          <p>
            Create bonPION using PION tokens. You need bonPION to setup a node,
            join PION Network and earn reward. Don't miss the chance to boost
            your NFT by 2x using USDC.
          </p>
        </FadeIn>
      ) : action === ActionType.UPGRADE ? (
        <FadeIn key={action} duration={0.1} delay={0.1}>
          <p>
            Select your bonPION, then you can increase its power using PION
            tokens and also you can boost it by 2x with USDC.
          </p>
        </FadeIn>
      ) : action === ActionType.MERGE ? (
        <FadeIn key={action} duration={0.1} delay={0.1}>
          <p>
            This page enables you to select some bonPION NFTs and merge them to
            one NFT.
          </p>
        </FadeIn>
      ) : action === ActionType.SPLIT ? (
        <FadeIn key={action} duration={0.1} delay={0.1}>
          <p>
            Choose a bonALICE to split and adjust the slider to distribute the
            power as desired.
          </p>
        </FadeIn>
      ) : action === ActionType.TRANSFER ? (
        <FadeIn key={action} duration={0.1} delay={0.1}>
          <p>
            Choose a bonALICE from your collection, then enter the destination
            address where you want to send it.
          </p>
        </FadeIn>
      ) : (
        <></>
      )}
    </>
  );
};

const renderActionName = (action: ActionType) => {
  return (
    <>
      <AnimatePresence>
        {action === ActionType.VIEW ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <p>View</p>
          </Scale>
        ) : action === ActionType.CREATE ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <p>Create</p>
          </Scale>
        ) : action === ActionType.UPGRADE ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <p>Increase</p>
          </Scale>
        ) : action === ActionType.MERGE ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <p>Merge</p>
          </Scale>
        ) : action === ActionType.SPLIT ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <p>Split</p>
          </Scale>
        ) : action === ActionType.TRANSFER ? (
          <Scale className="absolute" key={action} duration={0.1} delay={0.1}>
            <p>Transfer</p>
          </Scale>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionsHeader;
