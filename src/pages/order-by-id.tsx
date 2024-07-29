import { Alert, Button, Container, Divider, Table } from "@mantine/core";
import Layout from "../components/layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import { OrderResponse } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import {
  IconAlertTriangleFilled,
  IconArrowNarrowLeft,
} from "@tabler/icons-react";

export default function OrderByIdPage() {
  const { orderId } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useSWR<OrderResponse>(`/orders/${orderId}`);
  let navigate = useNavigate();
  // useEffect(() => {
  //   document.title = `${menu?.name ? menu?.name : "Untitled Menu"} | IOT Cafe`;
  // }, [menu]);

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

          {!!order && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                <h1>Order ที่ {order.id}</h1>
                <div>
                  <h3>สั่งโดย</h3>
                  <span className="text-xl ml-2">
                    {order.first_name} {order.last_name}
                  </span>
                  <h3 className="mt-2">เบอร์โทรศัพท์</h3>
                  <span className="text-xl ml-2">{order.phone}</span>
                  <h3 className="mt-2">สั่งเวลา</h3>
                  <span className="text-xl ml-2">
                    {new Date(order.ordered_on).toLocaleString()}
                  </span>
                </div>
              </div>
              <Divider className="my-4" />
              <h2>รายการสั่ง</h2>
              <Table className="w-full overflow-x-auto">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Menu ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Price</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {order.order_items.map((order) => (
                    <Table.Tr key={order.menu_id}>
                      <Table.Td>{order.menu_id}</Table.Td>
                      <Table.Td><Link to={`/menus/${order.menu_id}`}>{order.menu.name}</Link></Table.Td>
                      <Table.Td>{order.amount} ชิ้น</Table.Td>
                      <Table.Td>{order.price} บาท</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
