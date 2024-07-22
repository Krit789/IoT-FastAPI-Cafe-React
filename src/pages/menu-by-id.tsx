import {
  Alert,
  Button,
  Container,
  Divider,
} from "@mantine/core";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { MenuResponse } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";
import menuPlaceHolder from "../assets/images/menu_placeholder.png";

export default function MenuByIdPage() {
  const { menuId } = useParams();

  const {
    data: menu,
    isLoading,
    error,
  } = useSWR<MenuResponse>(`/menus/${menuId}`);

  return (
    <>
      <Layout>
        <Container>
          <div className="h-24"></div>
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
                  <span className="text-xl">{menu.price} บาท</span>
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
