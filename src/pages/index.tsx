import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center bg-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto max-w-screen-2xl py-8 lg:px-0 px-8">
        <h1 className="text-[48px]">เกี่ยวกับเรา</h1>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          <p className="text-left col-span-2">
            ยินดีต้อนรับสู่ IoT Book and Cafe
            สถานที่พักผ่อนหย่อนใจที่ผสานความรื่นรมย์ของหนังสือกับความหอมกรุ่นของกาแฟ
            ที่นี่คุณจะได้พบกับบรรยากาศอบอุ่นและเงียบสงบ
            เหมาะสำหรับการอ่านหนังสือ เล่นเกมส์ หรือเพียงแค่แวะมาพักผ่อน
            เรานำเสนอหนังสือหลากหลายแนว ทั้งนิยาย บทความ และวรรณกรรม
            พร้อมด้วยเครื่องดื่มและขนมอบแสนอร่อย เติมเต็มความสุขและความผ่อนคลาย
            มาสัมผัสประสบการณ์ใหม่ของการอ่านหนังสือในบรรยากาศสบายๆ
            และเพลิดเพลินไปกับกาแฟหอมกรุ่น ที่ IoT Book and Cafe
          </p>

          <div>
            <img
              src={ajPanwitImage}
              alt="Panwit Tuwanut"
              className="max-w-96 h-auto object-cover"
            />
          </div>
        </div>
        <p className="text-right mt-8">
          ปัจจุบันคาเฟ่และห้องสมุดของเราอยู่ในช่วงการดูแลของ <b>นาย จารุกิตติ์
          ศรีพาเพลิน รหัส 65070030</b> ซึ่งมีบริการอาหารและเครื่องดื่มหลากหลาย เช่น
          Espresso, Cappuccino, Caramel Macchiato และอื่น ๆ อีกมากมาย
          นอกจากนี้เรายังมีหนังสือให้เลือกอ่านมากมาย ทั้งหนังสือใหม่
          หนังสือมือสอง และหนังสือหายาก
          ท่านสามารถสมัครเป็นสมาชิกเพื่อรับส่วนลดพิเศษและสิทธิประโยชน์มากมาย
          สำหรับท่านที่ต้องการความสะดวกสบาย สามารถสั่งอาหารออนไลน์ผ่าน
          หน้าเมนูได้ทันที มาสัมผัสประสบการณ์ใหม่ของการอ่านหนังสือ พักผ่อน
          และเพลิดเพลินไปกับบรรยากาศที่ IoT Book and Cafe
        </p>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
