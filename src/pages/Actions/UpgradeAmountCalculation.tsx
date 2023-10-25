import { MoveUpIn } from '../../animations';
import { useTokenPrice } from '../../hooks/tokenPrice/useTokenPrice.ts';
import useUpgradeAction from '../../contexts/UpgradeAction/useUpgradeAction.ts';
import { useBooster } from '../../hooks/booster/useBooster.ts';

const UpgradeAmountCalculation = () => {
  const { upgradeAmount, upgradeBoostAmount, selectedUpgradeBonALICE } =
    useUpgradeAction();
  const { boostCoefficient } = useBooster();
  const { ALICEPrice } = useTokenPrice();

  if (!selectedUpgradeBonALICE) return null;
  if (!upgradeAmount.hStr && !upgradeBoostAmount.hStr) return null;
  if (!boostCoefficient) return null;

  if (!ALICEPrice) {
    return (
      <MoveUpIn
        y={-10}
        duration={0.1}
        delay={0.1}
        className="flex w-full justify-between items-center"
      >
        <span className="text-gray10">
          <p className="font-light">You get:</p>
          {upgradeAmount.big > BigInt(0) ? (
            <p className="font-light text-sm flex gap-1">
              {Number(upgradeAmount.hStr) +
                ' + ' +
                selectedUpgradeBonALICE.nodePower +
                ' PION'}
            </p>
          ) : (
            <p className="h-5"></p>
          )}
        </span>
        <span className="rounded-md bg-primary-dark px-3 py-2.5 text-xl font-bold text-white">
          {(
            Number(upgradeAmount.hStr) + selectedUpgradeBonALICE.nodePower
          ).toFixed(2)}
        </span>
      </MoveUpIn>
    );
  }

  return (
    <MoveUpIn
      y={-10}
      duration={0.1}
      delay={0.1}
      className="flex w-full justify-between items-center"
    >
      <span className="text-gray10">
        <p className="font-light">You get:</p>
        {upgradeBoostAmount.big > BigInt(0) ? (
          <p className="font-light text-sm flex gap-1">
            {upgradeBoostAmount.hStr +
              ' USDC -> ' +
              (
                Number(upgradeBoostAmount.hStr) /
                (Math.round(ALICEPrice * 10000) / 10000)
              ).toFixed(2) +
              ' PION '}
            <p className="text-uptime font-bold">x{boostCoefficient?.dsp}</p>
            {' + ' +
              Number(upgradeAmount.hStr) +
              ' PION + ' +
              selectedUpgradeBonALICE.nodePower}
          </p>
        ) : (
          <p className="h-5"></p>
        )}
      </span>
      <span className="rounded-md bg-primary-dark px-3 py-2.5 text-xl font-bold text-white">
        {(
          (Number(upgradeBoostAmount.hStr) /
            (Math.round(ALICEPrice * 10000) / 10000)) *
            boostCoefficient.dsp +
          Number(upgradeAmount.hStr) +
          selectedUpgradeBonALICE.nodePower
        ).toFixed(2)}
      </span>
    </MoveUpIn>
  );
};

export default UpgradeAmountCalculation;