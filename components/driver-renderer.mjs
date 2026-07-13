export function renderDriver(pose, driver) {
  driver.dataset.pose = pose;
  driver.setAttribute('aria-label', pose === 'in-car'
    ? 'ผู้หญิงสไตล์ฮาราจูกุอยู่ในรถ'
    : 'ผู้หญิงสไตล์ฮาราจูกุผมครึ่งแดงครึ่งดำ');
}
