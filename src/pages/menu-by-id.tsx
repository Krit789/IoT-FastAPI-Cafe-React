import { Alert, Button, Container, Divider } from "@mantine/core";
import Layout from "../components/layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MenuResponse } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import {
  IconAlertTriangleFilled,
  IconArrowNarrowLeft,
  IconEdit,
} from "@tabler/icons-react";
import menuPlaceHolder from "../assets/images/menu_placeholder.png";
import { useEffect } from "react";

export default function MenuByIdPage() {
  const { menuId } = useParams();

  const {
    data: menu,
    isLoading,
    error,
  } = useSWR<MenuResponse>(`/menus/${menuId}`);
  let navigate = useNavigate();

  useEffect(() => {
    document.title = `${menu?.name ? menu?.name : "Untitled Menu"} | IOT Cafe`;
  }, [menu]);

  return (
    <>
      <Layout>
        <Container>
          <div className="h-24"></div>
          <Button
            onClick={() => navigate(-1)}
            className="mb-2"
            variant="subtle"
            leftSection={<IconArrowNarrowLeft />}
          >
            ย้อนกลับ
          </Button>

          {isLoading && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          {!!menu && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = menuPlaceHolder;
                  }}
                  src={menu.image ? menu.image : menuPlaceHolder}
                  alt={menu.name}
                  className="w-full object-cover aspect-square"
                />
                <div>
                  <h1>{menu.name}</h1>
                  <h3>ราคา</h3>
                  <span className="text-xl ml-2">{menu.price} บาท</span>
                  <h3 className="mt-2">รายละเอียด</h3>
                  {menu.details ? (
                    <span className="ml-2">{menu.details}</span>
                  ) : (
                    <i className="text-black/50 ml-2">ไม่มีรายละเอียด</i>
                  )}
                </div>
              </div>

              <Divider className="mt-4" />

              <Button
                color="blue"
                size="xs"
                component={Link}
                to={`/menus/${menuId}/edit`}
                className="mt-4"
                leftSection={<IconEdit />}
              >
                แก้ไขข้อมูลเมนู
              </Button>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
