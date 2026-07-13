export function renderDriver(pose, driver) {
  driver.dataset.pose = pose;
  driver.alt = pose === 'in-car'
    ? 'ผู้หญิงสไตล์ฮาราจูกุอยู่ในรถ'
    : 'ผู้หญิงสไตล์ฮาราจูกุผมครึ่งแดงครึ่งดำ';
}
