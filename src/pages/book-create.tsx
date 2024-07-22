import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  NumberInput,
  TextInput,
  Textarea,
  MultiSelect,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { BookResponse, Category } from "../lib/models";
import CategoryEditorModal from "../components/category-editor";
import useSWR from "swr";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const bookCreateForm = useForm({
    initialValues: {
      title: "",
      author: "",
      year: new Date().getUTCFullYear(),
      is_published: false,
      image: "",
      summary: "",
      details: "",
      categories: [] as number[],
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      year: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  const { data: rawCategories, isLoading } = useSWR<Category[]>(`/categories`);

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const processedCategory = rawCategories
      ? rawCategories?.map((c) => {
          return { value: c.id.toString(), label: c.name };
        })
      : [];
    setCategories([...processedCategory]);
  }, [rawCategories]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleSubmit = async (values: typeof bookCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<BookResponse>(`/books`, values);
      notifications.show({
        title: "เพิ่มข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${response.data.id}`);
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
          <h1 className="text-xl">เพิ่มหนังสือในระบบ</h1>

          <form
            onSubmit={bookCreateForm.onSubmit(handleSubmit)}
            className="space-y-8"
          >
            <TextInput
              label="ชื่อหนังสือ"
              placeholder="ชื่อหนังสือ"
              {...bookCreateForm.getInputProps("title")}
            />

            <TextInput
              label="ชื่อผู้แต่ง"
              placeholder="ชื่อผู้แต่ง"
              {...bookCreateForm.getInputProps("author")}
            />

            <TextInput
              label="URL รูปภาพปก"
              placeholder="http://example.com"
              {...bookCreateForm.getInputProps("image")}
            />

            <NumberInput
              label="ปีที่พิมพ์"
              placeholder="ปีที่พิมพ์"
              min={1900}
              max={new Date().getFullYear() + 1}
              {...bookCreateForm.getInputProps("year")}
            />

            <Textarea
              label="รายละเอียดหนังสือ"
              placeholder="รายละเอียดหนังสือ"
              {...bookCreateForm.getInputProps("details")}
            />
            <Textarea
              label="เรื่องย่อ"
              placeholder="เรื่องย่อ"
              {...bookCreateForm.getInputProps("summary")}
            />
            <div className={`flex sm:items-end gap-2 sm:flex-row flex-col `}>
              <MultiSelect
                className="w-full"
                label="เพิ่มหมวดหมู่"
                placeholder="หมวดหมู่"
                data={categories}
                disabled={isLoading}
                {...bookCreateForm.getInputProps("categories")}
              />
              <div className="flex flex-row">
                <Button
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  แก้ไขหมวดหมู่
                </Button>
              </div>
            </div>
            <Checkbox
              label="เผยแพร่"
              {...bookCreateForm.getInputProps("is_published", {
                type: "checkbox",
              })}
            />
            <Divider />
            <div className="flex sm:items-end gap-2 sm:flex-row flex-col">
              <Button type="submit" loading={isProcessing}>
                บันทึกข้อมูล
              </Button>
            </div>
          </form>
          <CategoryEditorModal
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
          />
        </Container>
      </Layout>
    </>
  );
}
