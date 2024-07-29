import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-4.jpg";
import useSWR, { mutate } from "swr";
import { OrderResponse } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Popover, Table, Text } from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";

export default function OrdersPage() {
  const { data: orders, error } = useSWR<OrderResponse[]>("/orders");
  const handleDelete = async (orderID: number) => {
    try {
      await axios.delete(`/orders/${orderID}`);
      notifications.show({
        title: "ลบคำสั่งซื้อสำเร็จ",
        message: "ลบคำสั่งซื้อนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      mutate("/orders");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลคำสั่งซื้อ",
            message: "ไม่พบข้อมูลคำสั่งซื้อที่ต้องการลบ",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message:
            "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    }
  };

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center lg:bg-[center_-8rem] bg-[center-top]"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">ออเดอร์</h1>
          <h2>รายการออเดอร์ทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8 sm:px-0 px-4">
          <div className="flex justify-between items-center pb-4">
            <h1>รายการออเดอร์</h1>
          </div>

          {!orders && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="w-full overflow-x-auto">
            {!(!orders && !error) && (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order ID</Table.Th>
                    <Table.Th>First Name</Table.Th>
                    <Table.Th>Last Name</Table.Th>
                    <Table.Th>Phone Number</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {orders?.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>{order.id}</Table.Td>
                      <Table.Td>{order.first_name}</Table.Td>
                      <Table.Td>{order.last_name}</Table.Td>
                      <Table.Td>{order.phone}</Table.Td>
                      <Table.Td>
                        {new Date(order.ordered_on).toLocaleString()}
                      </Table.Td>
                      <Table.Td className="flex flex-row gap-2">
                        <Button
                          size="xs"
                          component={Link}
                          to={`/orders/${order.id}`}
                          leftSection={<IconEye />}
                        >
                          ดูรายการ
                        </Button>
                        <DeletePopover
                          handleDelete={handleDelete}
                          orderID={order.id}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}

function DeletePopover({
  handleDelete,
  orderID,
}: {
  handleDelete: Function;
  orderID: number;
}) {
  const [opened, { close, open }] = useDisclosure(false);
  const handleIntDelete = () => {
    close();
    handleDelete(orderID);
  };
  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Button
          size="xs"
          onClick={() => {
            if (opened) {
              close();
            } else {
              open();
            }
          }}
          color="red"
        >
          <IconTrash />
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="flex flex-col gap-y-2">
        <Text size="xs">Are you sure? This action cannot be revert.</Text>
        <Button onClick={() => handleIntDelete()} color="red" size="xs">
          Delete
        </Button>
        <Button color="gray" onClick={close} size="xs">
          Cancel
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}
