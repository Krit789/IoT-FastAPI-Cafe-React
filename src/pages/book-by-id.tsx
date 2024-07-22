import {
  Alert,
  Badge,
  Button,
  Container,
  Divider,
  HoverCard,
  Group,
  Text,
} from "@mantine/core";
import Layout from "../components/layout";
import { Link, useParams } from "react-router-dom";
import { Category, SingleBook } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";
import bookPlaceHolder from "../assets/images/cover_placeholder.png";

export default function BookByIdPage() {
  const { bookId } = useParams();

  const {
    data: book,
    isLoading,
    error,
  } = useSWR<SingleBook>(`/books/${bookId}`);

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

          {!!book && (
            <>
              <h1>{book.title}</h1>
              <p className="italic text-neutral-500 mb-4">โดย {book.author}</p>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = bookPlaceHolder;
                  }}
                  src={book.image ? book.image : bookPlaceHolder}
                  alt={book.title}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="col-span-2 px-4 space-y-2 py-4">
                  <h3>รายละเอียดหนังสือ</h3>
                  <p className="indent-4">
                    {book.details ? (
                      book.details
                    ) : (
                      <i className="text-black/50">ไม่มีรายละเอียด</i>
                    )}
                  </p>

                  <h3>เรื่องย่อ</h3>
                  <p className="indent-4">
                    {book.summary ? (
                      book.summary
                    ) : (
                      <i className="text-black/50">ไม่มีเรื่องย่อ</i>
                    )}
                  </p>

                  <h3>หมวดหมู่</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.categories &&
                      book.categories.map((tag) => (
                        <TagHoverCard key={`hover_card_${tag.id}`} tag={tag} />
                      ))}
                    {book.categories && !book.categories.length && (
                      <Badge color="grey">ไม่มี Tag</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Divider className="mt-4" />

              <Button
                color="blue"
                size="xs"
                component={Link}
                to={`/books/${bookId}/edit`}
                className="mt-4"
                leftSection={<IconEdit />}
              >
                แก้ไขข้อมูลหนังสือ
              </Button>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}

function TagHoverCard({ tag }: { tag: Category }) {
  return (
    <>
      {tag.detail ? (
        <Group justify="center">
          <HoverCard width={180} shadow="md">
            <HoverCard.Target>
              <Badge color="teal" key={tag.id}>
                #{tag.name}
              </Badge>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">{tag.detail}</Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      ) : (
        <Badge color="teal" key={tag.id}>
          #{tag.name}
        </Badge>
      )}
    </>
  );
}
