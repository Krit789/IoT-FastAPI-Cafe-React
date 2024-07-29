import useSWR from "swr";
import { MenuResponse } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import {
  Alert,
  Button,
  Container,
  Divider,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function MenuEditById() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: menu,
    isLoading,
    error,
  } = useSWR<MenuResponse>(`/menus/${menuId}`);

  useEffect(() => {
    const formValue = {
      name: menu?.name ? menu?.name : "",
      details: menu?.details ? menu.details : "",
      image: menu?.image ? menu.image : "",
      price: menu?.price ? menu.price : 10,
    };
    menuEditForm.setInitialValues(formValue);
    menuEditForm.setValues(formValue);
  }, [menu]);

  const menuEditForm = useForm({
    initialValues: {
      name: "",
      details: "",
      image: "",
      price: 10,
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      price: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof menuEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/menus/${menuId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus/${menuId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลเมนู",
            message: "ไม่พบข้อมูลเมนูที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (error.response?.status === 422) {
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

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/menus/${menuId}`);
      notifications.show({
        title: "ลบเมนูสำเร็จ",
        message: "ลบเมนูนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/menus");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการลบ",
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
    <>
      <Layout>
        <Container>
          <div className="h-24"></div>
          <h1 className="text-xl">แก้ไขข้อมูลเมนู</h1>
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
              <form
                onSubmit={menuEditForm.onSubmit(handleSubmit)}
                className="space-y-8"
              >
                <TextInput
                  label="ชื่อเมนู"
                  placeholder="ชื่อเมนู"
                  {...menuEditForm.getInputProps("name")}
                />

                <NumberInput
                  label="ราคา"
                  placeholder="ราคา"
                  min={0}
                  {...menuEditForm.getInputProps("price")}
                />
                <Textarea
                  label="รายละเอียด"
                  placeholder="มีถั่ว มีชีส มีหมู"
                  {...menuEditForm.getInputProps("details")}
                />
                <TextInput
                  label="URL รูปภาพ"
                  placeholder="https://example.com"
                  {...menuEditForm.getInputProps("image")}
                />

                <Divider />
                <div className="flex items-center gap-2 sm:flex-row flex-col sm:justify-between">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบเมนูนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำนเนินการลบเมนูนี้แล้ว
                            จะไม่สามารถย้อนกลับได้
                          </span>
                        ),
                        labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          handleDelete();
                        },
                        confirmProps: {
                          color: "red",
                        },
                      });
                    }}
                  >
                    ลบเมนูนี้
                  </Button>
                  <Button type="submit" loading={isProcessing}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </form>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
