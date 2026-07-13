# Pixel Roadside Pause — Redesign Spec

## Goal

สร้างประสบการณ์ pixel-art ฉากเดียวสำหรับช่วยให้ผู้เล่นหยุดพักและยิ้มได้ ผ่านเหตุการณ์สั้น ๆ ที่เห็นผลในฉาก ไม่ใช่การอ่านข้อความหรือกดปุ่ม UI หลายกล่อง

## Visual system

- ใช้รถ sprite สีขาวใน `assets/car-white.png` เป็น style anchor ของทั้งงาน: pixel edges ที่คม, outline สีเข้ม, เงา blocky, highlight สีขาว/ม่วงอ่อน, และรายละเอียดแบบ JDM ยุค 90s
- งานจริงใช้ canvas 16:9 ความละเอียด 1280 × 720 เป็นอย่างน้อย แล้วแสดงผล responsive โดยรักษาอัตราส่วน; ห้ามใช้ gradient ลื่น ๆ หรือ emoji เป็น art asset
- ท้องฟ้า ถนน ร้านขนม ตู้กดน้ำ ป้ายไฟ คนขับ และเอฟเฟกต์ต้องเป็น pixel art ที่มี palette และความหนาเส้นร่วมกับรถ
- ข้อความเป็นองค์ประกอบ interaction เท่านั้น: cue สั้นก่อนกด และข้อความสุดท้ายบนป้ายไฟ ห้ามมี heading, card, modal, footer หรือข้อความตกแต่งนอกฉาก

## Component boundaries

- `Scene`: จัดการ background layers, palette ที่เปลี่ยนจาก warm เป็น cool และ responsive canvas scale
- `Car`: แสดงรถ, opening-door cue และ drive-in/drive-out animation
- `Driver`: ผู้หญิงแต่งตัวสไตล์ฮาราจูกุ ผมแบ่งครึ่งแดง–ดำ; มี sprite และ animation สำหรับลงจากรถ, เดินไปตู้, รับน้ำ, เดินกลับ และเงาตามพื้น
- `SnackShop`: art ของร้าน, ตู้กดน้ำ, เคาน์เตอร์, และป้ายไฟ
- `VendingMachine`: จุด interaction ที่สอง; ปล่อยกระป๋องน้ำ pixel และกระตุ้น palette เย็น
- `NeonSign`: จุด interaction สุดท้าย; เปลี่ยนป้ายเป็นข้อความกำลังใจที่กำหนดไว้
- `InteractionCue`: label สั้นที่ยึดติดกับวัตถุเป้าหมายเสมอ ไม่เป็นกล่องลอยกลางฉาก
- `GameState`: ควบคุม transition ที่ถูกต้องและไม่ให้ข้ามลำดับ

## Player journey

1. รถสีขาวขับเข้ามาจอดหน้าร้านในฉากโทน warm; ผู้เล่นแตะประตูรถ
2. คนขับสาวฮาราจูกุผมครึ่งแดง–ดำลงจากรถและเดินไปตู้กดน้ำ; ผู้เล่นแตะตู้กดน้ำ แล้วเธอรับน้ำเย็นและฉากเปลี่ยนโทน cool
3. เธอเดินกลับมาที่รถและมองป้ายไฟ; ผู้เล่นแตะป้าย แล้วป้ายไฟสว่างขึ้นและแสดงข้อความกำลังใจหนึ่งข้อความ
4. เธอกลับเข้ารถและรถขับออก พร้อมเอฟเฟกต์ดาวเล็ก ๆ; ป้ายไฟยังคงข้อความไว้ก่อนเปลี่ยนเป็นเริ่มรอบใหม่

## Approved message set

- ยิ้มหน่อยสิ ออกจะน่ารัก
- โลกสวยด้วยรอยยิ้มเธอนะ
- ความน่ารักของเธอ ทำให้คืนนี้ดีขึ้นเยอะเลย

## Interaction and accessibility

- แต่ละช่วงเปิด interaction ได้เพียงจุดเดียว และมี label ภาษาไทยที่อ่านง่ายผูกกับเป้าหมายนั้น
- เป้าหมายทุกจุดเป็น `<button>` ที่รองรับ mouse, touch, Enter และ Space พร้อม `aria-label`
- `aria-live` ประกาศเหตุการณ์สำคัญโดยไม่ต้องพึ่งการมองเห็น
- เมื่อ `prefers-reduced-motion` เปิดอยู่ ให้แสดง pose ปลายทางแทนการเล่น animation ยาว และยังเล่นจบได้
- ไม่มี timer, score, แพ้, หรือข้อความตำหนิผู้เล่น

## Technical design

- ใช้ HTML, CSS และ Vanilla JavaScript แบบ static site ให้ deploy บน GitHub Pages ได้
- วาด sprite และ background asset เป็น PNG pixel art ใน `assets/`; CSS ทำหน้าที่ layout, scaling, parallax เล็กน้อย และ frame-based transforms เท่านั้น
- `game-state.mjs` เป็น pure state machine และมี Node built-in tests สำหรับ transition ทุกช่วงและการป้องกันการข้ามช่วง
- `script.js` เป็น DOM adapter ที่ฟัง event จาก component button แล้ว render state, animation class และ cue เท่านั้น

## Verification

- ทดสอบ state path: arrive → open car → vending → sign → depart → restart; action ผิดลำดับต้องไม่เปลี่ยน state
- ตรวจภาพ desktop และ mobile เพื่อยืนยันว่าพื้นที่ฉาก 16:9 ไม่เกิด horizontal overflow และ target แตะได้ง่าย
- เปิดด้วย `prefers-reduced-motion` และเล่นครบ flow ได้
- เปิดจาก GitHub Pages project path แล้ว asset ทุกตัวต้องโหลดด้วย relative path
