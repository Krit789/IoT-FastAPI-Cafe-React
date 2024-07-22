import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Textarea,
  TextInput,
  Popover,
  Text
} from "@mantine/core";
import { Category } from "../lib/models";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { isNotEmpty, useForm } from "@mantine/form";

export default function CategoryEditorModal({
  setModalOpen,
  modalOpen,
}: {
  setModalOpen: Function;
  modalOpen: boolean;
}) {
  const { data: rawCategories } = useSWR<Category[]>(`/categories`);
  const [ showCreate, setShowCreate ] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);


  useEffect(() => {
    if (modalOpen) open();
    else {
      close()
      setTimeout(() => setShowCreate(false), 1000)
    };
  }, [modalOpen]);

  useEffect(() => {
    setModalOpen(opened);
  }, [opened]);


  return (
    <>
      <Modal opened={opened} onClose={close} title="จัดการหมวดหมู่" centered>
        <h1>หมวดหมู่ทั้งหมด</h1>
          {showCreate ? <CreateCategory /> : <Button size="xs" className="my-2" onClick={() => setShowCreate(!showCreate)}>เพิ่มหมวดหมู่</Button>}
        <div className="border border-1 rounded-md md:max-h-[480px] max-h-[400px] overflow-auto flex flex-col gap-y-4 mt-2">
          {rawCategories?.map((ct) => (
            <CategoryItem ct={ct} key={ct.id} />
          ))}
        </div>
      </Modal>
    </>
  );
}

function CreateCategory() {
  const createForm = useForm({
    initialValues: {
      name: "",
      detail: "",
    },
    validate: {
      name: isNotEmpty("กรุณาระบุชื่อหมวดหมู่"),
    },
  });
  const handleCreate = async (values: typeof createForm.values) => {
    try {
      await axios.post<{ message: string }>(`/categories`, values);
      mutate("/categories");

      notifications.show({
        title: "สร้างหมวดหมู่สำเร็จ",
        message: "หมวดหมู่ได้ถูกสร้างเรียบร้อยแล้ว",
        color: "teal",
      });
      createForm.values.name = "";
      createForm.values.detail = "";
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
    }
  };
  return (
    <div className="bg-gray-100 p-4 rounded-md relative top-0">
      <h3>สร้างหมวดหมู่ใหม่</h3>
      <form
        className="flex flex-col gap-2"
        onSubmit={createForm.onSubmit(handleCreate)}
      >
        <div className="flex flex-col gap-2 items-center">
          <TextInput
            label="ชื่อหมวดหมู่"
            className="w-full"
            {...createForm.getInputProps("name")}
          ></TextInput>
          <Textarea
            label="รายละเอียดหมวดหมู่"
            className="w-full"
            {...createForm.getInputProps("detail")}
          ></Textarea>
          <div className="w-full flex">
            <Button color="green" type="submit">
              Create
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function CategoryItem({ ct }: { ct: Category }) {
  const [editing, setEditing] = useState<boolean>(false);
  const [startingState, setStartingState] = useState<Category>({ ...ct });
  const [myState, setMyState] = useState<Category>({ ...ct });
  const editForm = useForm({
    initialValues: {
      name: myState.name ? myState.name : "",
      detail: myState.detail ? myState.detail : "",
    },
    validate: {
      name: isNotEmpty("กรุณาระบุชื่อหมวดหมู่"),
    },
  });

  const handleUpdate = async (values: typeof editForm.values) => {
    setEditing(false);
    setMyState({ ...myState, ...values });
    try {
      await axios.patch<{ message: string }>(`/categories/${ct.id}`, values);
      mutate("/categories");

      notifications.show({
        title: "แก้ไขหมวดหมู่สำเร็จ",
        message: "หมวดหมู่ได้ถูกแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
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
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete<{ message: string }>(`/categories/${ct.id}`);
      mutate("/categories");

      notifications.show({
        title: "ลบหมวดหมู่สำเร็จ",
        message: "หมวดหมู่ได้ถูกลบเรียบร้อยแล้ว",
        color: "teal",
      });
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
    }
  };

  useEffect(() => {
    setStartingState({ ...ct });
    setMyState({ ...ct });
  }, []);
  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <form
        className="flex flex-col gap-2"
        onSubmit={editForm.onSubmit(handleUpdate)}
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="bg-[--mantine-primary-color-filled] size-7 grid place-items-center rounded-full font-bold text-sm">
            {myState.id}
          </div>
          <div>
            {!editing ? (
              myState.name
            ) : (
              <TextInput {...editForm.getInputProps("name")}></TextInput>
            )}
          </div>
        </div>
        <div>
          {!editing ? (
            myState.detail ? (
              myState.detail
            ) : (
              <i>ไม่มีคำอธิบาย</i>
            )
          ) : (
            <Textarea {...editForm.getInputProps("detail")}></Textarea>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {!editing && <DeletePopover handleDelete={handleDelete} />}
          {editing && (
            <Button color="green" type="submit">
              Save
            </Button>
          )}
          <Button
            color="blue"
            onClick={() => {
              if (editing) {
                setMyState({ ...startingState });
                setEditing(!editing);
              } else {
                setEditing(!editing);
              }
            }}
          >
            {editing ? "Undo" : "Edit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function DeletePopover({ handleDelete }: { handleDelete: Function }) {
  const [opened, { close, open }] = useDisclosure(false);
  const handleIntDelete = () => {
    close();
    handleDelete();
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
          onClick={() => {
            if (opened) {
              close();
            } else {
              open();
            }
          }}
          color="red"
        >
          Delete
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
