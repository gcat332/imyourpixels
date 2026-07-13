export function renderTargets(activeTarget, targets) {
  targets.car.disabled = activeTarget !== 'car';
  targets.vending.disabled = activeTarget !== 'vending';
  targets.sign.disabled = activeTarget !== 'sign';
}
