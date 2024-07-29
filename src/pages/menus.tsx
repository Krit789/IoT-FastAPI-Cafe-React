import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import menuPlaceHolder from "../assets/images/menu_placeholder.png";
import useSWR from "swr";
import { MenuResponse, OrderBase, OrderItem } from "../lib/models";
import Loading from "../components/loading";
import {
  Alert,
  Button,
  Divider,
  Drawer,
  LoadingOverlay,
  Modal,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconEdit,
  IconPlus,
  IconShoppingCart,
  IconTrashFilled,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import usePersistantState from "../hooks/usePersistantState";
import { useEffect, useState } from "react";
import {
  hasLength,
  isInRange,
  isNotEmpty,
  useForm,
  UseFormReturnType,
} from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";

export default function MenusPage() {
  const { data: menus, error } = useSWR<MenuResponse[]>("/menus");

  const [cartOpened, { open: cartOpen, close: cartClose }] =
    useDisclosure(false);
  const [addItemOpened, { open: addItemOpen, close: addItemClose }] =
    useDisclosure(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuResponse>();
  const [cart, setCart] = usePersistantState<OrderItem[]>(
    "cafe-cart-items",
    []
  );

  const orderItemAddForm = useForm({
    initialValues: {
      menu_id: 0,
      amount: 1,
      price: 0,
      additional_info: "",
    },

    validate: {
      menu_id: isNotEmpty("ID ไม่ควรหายไป"),
      amount: isInRange(
        { min: 1, max: 10 },
        "สั่งอย่างน้อย 1 และไม่มากกว่า 10"
      ),
    },
  });

  const getMenuByID = (id: number) => menus?.find((menu) => menu.id === id);

  useEffect(() => {
    orderItemAddForm.setValues({
      ...orderItemAddForm.values,
      price:
        orderItemAddForm.values.amount *
        (currentMenuItem?.price ? currentMenuItem?.price : 0),
    });
  }, [orderItemAddForm.values.amount]);

  const handleItemOpen = (menu: MenuResponse) => {
    setCurrentMenuItem({ ...menu });
    addItemOpen();
    const inCart = cart.find((item) => item.menu_id === menu.id);
    const formValues = {
      menu_id: inCart?.menu_id ?? menu.id ?? 0 ?? 0,
      amount: inCart?.amount ?? 1,
      price: inCart?.price ?? menu?.price,
      additional_info: inCart?.additional_info ?? "",
    };
    orderItemAddForm.setValues(formValues);
  };

  const handleItemSubmit = (values: typeof orderItemAddForm.values) => {
    const inCartIndex = cart.findIndex(
      (item) => item.menu_id === values.menu_id
    );
    if (inCartIndex !== -1) {
      const updatedCard = cart;
      cart[inCartIndex] = values;
      setCart([...updatedCard]);
    } else {
      setCart([...cart, values]);
    }
    addItemClose();
  };

  return (
    <>
      <CartModal
        cartOpened={cartOpened}
        cartClose={cartClose}
        cart={cart}
        setCart={setCart}
        getMenuByID={getMenuByID}
        handleItemOpen={handleItemOpen}
      />
      <AddItemModal
        addItemOpened={addItemOpened}
        addItemClose={addItemClose}
        currentMenuItem={currentMenuItem}
        orderItemAddForm={orderItemAddForm}
        handleItemSubmit={handleItemSubmit}
      />
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
                onClick={cartOpen}
              >
                ดูตะกร้า {cart ? `(${cart.length})` : ""}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {menus?.map((menu) => (
              <div
                className="border border-solid border-neutral-200"
                key={`menu_list_${menu.id}`}
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
                    size="xs"
                    variant="light"
                    onClick={() => handleItemOpen(menu)}
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

function CartModal({
  cartOpened,
  cartClose,
  cart,
  setCart,
  getMenuByID,
  handleItemOpen,
}: {
  cartOpened: boolean;
  cartClose: () => void;
  cart: OrderItem[];
  setCart: (value: OrderItem[]) => void;
  getMenuByID: (id: number) => MenuResponse | undefined;
  handleItemOpen: (menu: MenuResponse) => void;
}) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const cartItemForm = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      order_items: [] as OrderItem[],
    },

    validate: {
      first_name: isNotEmpty("กรุณาใส่ชื่อ"),
      last_name: isNotEmpty("กรุณาใส่นามสกุล"),
      phone: hasLength({ min: 10, max: 10 }, "กรุณาใส่เบอร์โทรศัพท์"),
      order_items: isNotEmpty("กรุณาสั้งอาหารก่อน"),
    },
  });

  useEffect(() => {
    cartItemForm.setValues({ ...cartItemForm.values, order_items: cart });
  }, [cart]);

  const handleSubmit = async (values: typeof cartItemForm.values) => {
    try {
      setIsProcessing(true);
      await axios.post<OrderBase>(`/orders`, values);
      notifications.show({
        title: "ส่งเมนูสำเร็จ",
        message: "เมนูถูกส่งเข้าครัวเรียบร้อย",
        color: "teal",
      });
      setCart([]);
      cartClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
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
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Drawer
      opened={cartOpened}
      onClose={cartClose}
      title="ตะกร้าของคุณ"
      position="right"
    >
      <LoadingOverlay
        visible={isProcessing}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div className="flex flex-col justify-between h-[90vh]">
        <div className="flex flex-col gap-y-4 max-h-[500px] h-full overflow-auto">
          {cart.map((item, index) => (
            <div className="flex flex-col" key={`order_list_${item.menu_id}`}>
              <div className="flex flex-row gap-x-4 bg-gradient-to-tr from-gray-100 to-gray-50/50 rounded-md">
                <div className="size-24">
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = menuPlaceHolder;
                    }}
                    src={getMenuByID(item.menu_id)?.image ?? menuPlaceHolder}
                    alt={getMenuByID(item.menu_id)?.name}
                    className="w-full object-cover aspect-square rounded-md shadow-lg"
                  />
                </div>
                <div className="flex flex-col x-4 py-2 flex-1 relative">
                  <h4>{getMenuByID(item.menu_id)?.name}</h4>
                  <p>จำนวน {item.amount} ชิ้น</p>
                  <p>
                    ราคา {item.amount * (getMenuByID(item.menu_id)?.price ?? 0)}{" "}
                    บาท
                  </p>
                  <div className="absolute right-0 bottom-0">
                    <Button
                      leftSection={<IconEdit />}
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        const menu = getMenuByID(item.menu_id);
                        if (menu) {
                          handleItemOpen(menu);
                        }
                      }}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="subtle"
                      onClick={() => {
                        const updatedCart = [...cart];
                        updatedCart.splice(index, 1);
                        setCart([...updatedCart]);
                      }}
                    >
                      <IconTrashFilled />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart && cart.length > 0 ? (
          <>
            <div className="pt-4 text-right">
              <h3>
                ทั้งหมด{" "}
                {cart
                  .map(
                    (item) =>
                      (getMenuByID(item.menu_id)?.price ?? 0) * item.amount
                  )
                  .reduce((partialSum, a) => partialSum + a, 0)}{" "}
                บาท
              </h3>
            </div>
            <form
              className="flex flex-col w-full bg-white gap-y-2 pt-2"
              onSubmit={cartItemForm.onSubmit(handleSubmit)}
            >
              <TextInput
                label="ชื่อ"
                {...cartItemForm.getInputProps("first_name")}
              />
              <TextInput
                label="นามสกุล"
                {...cartItemForm.getInputProps("last_name")}
              />
              <TextInput
                label="เบอร์โทรศัพท์"
                type="tel"
                {...cartItemForm.getInputProps("phone")}
              ></TextInput>
              <Divider className="my-2" />
              <Button type="submit">ส่งรายการ</Button>
            </form>
          </>
        ) : (
          <h1>กรุณานำเมนูเข้าตะกร้าก่อน</h1>
        )}
      </div>
    </Drawer>
  );
}

function AddItemModal({
  addItemOpened,
  addItemClose,
  currentMenuItem,
  orderItemAddForm,
  handleItemSubmit,
}: {
  addItemOpened: boolean;
  addItemClose: () => void;
  currentMenuItem: MenuResponse | undefined;
  orderItemAddForm: UseFormReturnType<
    {
      menu_id: number;
      amount: number;
      price: number;
      additional_info: string;
    },
    (values: {
      menu_id: number;
      amount: number;
      price: number;
      additional_info: string;
    }) => {
      menu_id: number;
      amount: number;
      price: number;
      additional_info: string;
    }
  >;
  handleItemSubmit: (values: {
    menu_id: number;
    amount: number;
    price: number;
    additional_info: string;
  }) => void;
}) {
  return (
    <Modal
      opened={addItemOpened}
      onClose={addItemClose}
      title="เพิ่มรายการสั่ง"
      centered
    >
      <h2>{currentMenuItem?.name}</h2>
      <i className="text-black/50">{currentMenuItem?.details}</i>
      <form
        onSubmit={orderItemAddForm.onSubmit(handleItemSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-2">
          <TextInput
            type="hidden"
            {...orderItemAddForm.getInputProps("menu_id")}
          />
          <TextInput
            type="hidden"
            {...orderItemAddForm.getInputProps("price")}
          />
          <NumberInput
            label="จำนวน"
            placeholder="จำนวน"
            min={1}
            {...orderItemAddForm.getInputProps("amount")}
          />
          <Textarea
            label="รายละเอียดเพิ่มเติม"
            placeholder="ไม่ใส่นม"
            {...orderItemAddForm.getInputProps("additional_info")}
          ></Textarea>
          <Divider className="my-2" />

          <p className="text-right font-bold mb-2">
            ราคา {orderItemAddForm.values.price} บาท
          </p>
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Modal>
  );
}
