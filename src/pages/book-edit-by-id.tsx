import useSWR from "swr";
import { Category, SingleBook } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Divider,
  MultiSelect,
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
import CategoryEditorModal from "../components/category-editor";

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: book,
    isLoading,
    error,
  } = useSWR<SingleBook>(`/books/${bookId}`);

  const { data: rawCategories } = useSWR<Category[]>(`/categories`);
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

  useEffect(() => {
    const processedCategory = book?.categories
      ? book?.categories?.map((c) => {
          return c.id.toString();
        })
      : [];
    const formValue = {
      title: book?.title ? book?.title : "",
      author: book?.author ? book?.author : "",
      year: book?.year ? book?.year : new Date().getFullYear(),
      is_published: book?.is_published ? book?.is_published : false,
      image: book?.image ? book?.image : "",
      summary: book?.summary ? book?.summary : "",
      details: book?.details ? book?.details : "",
      categories: processedCategory ? processedCategory : [],
    };
    bookEditForm.setInitialValues(formValue);
    bookEditForm.setValues(formValue);
  }, [book]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const bookEditForm = useForm({
    initialValues: {
      title: "",
      author: "",
      year: new Date().getFullYear(),
      is_published: false,
      image: "",
      summary: "",
      details: "",
      categories: [] as string[],
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      year: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof bookEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/books/${bookId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข",
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
      await axios.delete(`/books/${bookId}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ",
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/books");
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
          <h1 className="text-xl">แก้ไขข้อมูลหนังสือ</h1>
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

          {!!book && (
            <>
              <form
                onSubmit={bookEditForm.onSubmit(handleSubmit)}
                className="space-y-8"
              >
                <TextInput
                  label="ชื่อหนังสือ"
                  placeholder="ชื่อหนังสือ"
                  {...bookEditForm.getInputProps("title")}
                />

                <TextInput
                  label="ชื่อผู้แต่ง"
                  placeholder="ชื่อผู้แต่ง"
                  {...bookEditForm.getInputProps("author")}
                />

                <TextInput
                  label="URL รูปภาพปก"
                  placeholder="http://example.com"
                  {...bookEditForm.getInputProps("image")}
                />

                <NumberInput
                  label="ปีที่พิมพ์"
                  placeholder="ปีที่พิมพ์"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  {...bookEditForm.getInputProps("year")}
                />

                <Textarea
                  label="รายละเอียดหนังสือ"
                  placeholder="รายละเอียดหนังสือ"
                  {...bookEditForm.getInputProps("details")}
                />
                <Textarea
                  label="เรื่องย่อ"
                  placeholder="เรื่องย่อ"
                  {...bookEditForm.getInputProps("summary")}
                />
                <div
                  className={`flex sm:items-end gap-2 sm:flex-row flex-col `}
                >
                  <MultiSelect
                    className="w-full"
                    label="เพิ่มหมวดหมู่"
                    placeholder="หมวดหมู่"
                    data={categories}
                    disabled={isLoading}
                    {...bookEditForm.getInputProps("categories")}
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
                  {...bookEditForm.getInputProps("is_published", {
                    type: "checkbox",
                  })}
                />

                <Divider />

                <div className="flex justify-between">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำนเนินการลบหนังสือเล่มนี้แล้ว
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
                    ลบหนังสือนี้
                  </Button>

                  <Button type="submit" loading={isLoading || isProcessing}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </form>
              <CategoryEditorModal
                setModalOpen={setModalOpen}
                modalOpen={modalOpen}
              />
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
