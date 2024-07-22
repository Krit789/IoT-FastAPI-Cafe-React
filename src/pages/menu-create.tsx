import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import {
  Button,
  Container,
  Divider,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { BookResponse } from "../lib/models";

export default function MenuCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const menuCreateForm = useForm({
    initialValues: {
      name: "",
      image: "",
      price: 10,
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      price: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof menuCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<BookResponse>(`/menus`, values);
      notifications.show({
        title: "เพิ่มเมนูสือสำเร็จ",
        message: "ข้อมูลเมนูได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus/${response.data.id}`);
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
    <>
      <Layout>
        <Container>
          <div className="h-24"></div>
          <h1 className="text-xl">เพิ่มเมนูในระบบ</h1>
          <form
            onSubmit={menuCreateForm.onSubmit(handleSubmit)}
            className="space-y-8"
          >
            <TextInput
              label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
              {...menuCreateForm.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...menuCreateForm.getInputProps("price")}
            />
            <TextInput
              label="URL รูปภาพ"
              placeholder="https://example.com"
              {...menuCreateForm.getInputProps("image")}
            />

            <Divider />
            <div className="flex sm:items-end gap-2 sm:flex-row flex-col">
              <Button type="submit" loading={isProcessing}>
                บันทึกข้อมูล
              </Button>
            </div>
          </form>
        </Container>
      </Layout>
    </>
  );
}
