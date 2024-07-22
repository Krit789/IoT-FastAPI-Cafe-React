import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import menuPlaceHolder from "../assets/images/menu_placeholder.png";
import useSWR from "swr";
import { Menu } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus, IconShoppingCart } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function MenusPage() {
  const { data: menus, error } = useSWR<Menu[]>("/menus");

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center bg-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">เมนู</h1>
          <h2>รายการเมนูทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8 sm:px-0 px-4">
          <div className="flex justify-between items-center pb-4">
            <h1>รายการเมนู</h1>
            <div className="flex flex-row gap-x-2">
              <Button
                component={Link}
                leftSection={<IconPlus />}
                to="/menus/create"
                size="xs"
                variant="primary"
                className="flex items-center space-x-2"
              >
                เพิ่มเมนู
              </Button>
              <Button
                leftSection={<IconShoppingCart />}
                size="xs"
                variant="primary"
                className="flex items-center space-x-2"
              >
                ดูตะกร้า
              </Button>
            </div>
          </div>

          {!menus && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {menus?.map((menu) => (
              <div
                className="border border-solid border-neutral-200"
                key={menu.id}
              >
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = menuPlaceHolder;
                  }}
                  src={menu.image ? menu.image : menuPlaceHolder}
                  alt={menu.name}
                  className="w-full object-cover aspect-square sm:h-auto"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">
                    {menu.name}
                  </h2>
                  <p className="text-xs text-neutral-500">{menu.price} บาท</p>
                </div>

                <div className="flex px-4 pb-2 justify-between gap-x-2">
                  <Button
                    component={Link}
                    to={`/menus/${menu.id}`}
                    size="xs"
                    variant="transparent"
                  >
                    ดูรายละเอียด
                  </Button>
                  <Button
                    component={Link}
                    to={`/menus/${menu.id}`}
                    size="xs"
                    variant="light"
                  >
                    เพิ่มลงตะกร้า
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
