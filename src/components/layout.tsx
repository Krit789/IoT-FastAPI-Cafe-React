import { Box, Group, ActionIcon, Button } from "@mantine/core";
import websiteLogo from "../assets/iotcafe_logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import usePersistantState from "../hooks/usePersistantState";
import { notifications } from "@mantine/notifications";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isAuth, setIsAuth] = usePersistantState<{ isAuth: boolean }>(
    "is-auth",
    { isAuth: false }
  );
  const location = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth.isAuth && location === "orders") {
      navigate("/");
      notifications.show({
        title: "คุณไม่มีสิทธิเข้าถึงหน้านี้",
        message: "กรุณาปลอมตัวเป็น Admin แล้วลองใหม่",
        color: "red",
      });
    }
  }, [isAuth.isAuth]);

  return (
    <>
      <Box>
        <header className="h-14 border fixed w-full bg-transparent z-50">
          <div
            className={`absolute top-[67px] bg-gray-100/70 backdrop-blur-md pl-4 pr-20 sm:hidden block rounded-br-md transition-all ${
              navOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
            }`}
          >
            <Link
              to={"/"}
              className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                location === "" ? "font-semibold text-orange-600" : ""
              }`}
            >
              หน้าหลัก
            </Link>

            <Link
              to={"/books"}
              className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                location === "books" ? "font-semibold text-orange-600" : ""
              }`}
            >
              หนังสือ
            </Link>

            <Link
              to={"/menus"}
              className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                location === "menus" ? "font-semibold text-orange-600" : ""
              }`}
            >
              เมนู
            </Link>
            {isAuth.isAuth && (
              <Link
                to={"/orders"}
                className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                  location === "orders" ? "font-semibold text-orange-600" : ""
                }`}
              >
                ออเดอร์
              </Link>
            )}
            <Button
              size="xs"
              className="mb-4"
              onClick={() => {
                setIsAuth({ isAuth: !isAuth.isAuth });
              }}
            >
              Admin Mode
            </Button>
          </div>
          <div className="flex justify-start gap-x-8 bg-white/70 backdrop-blur-md sm:mx-8 sm:mt-4 sm:px-8 sm:py-1 px-4 py-2 sm:rounded-md transition-all">
            <div className="justify-center items-center sm:hidden flex">
              <ActionIcon
                variant="transparent"
                color="black"
                onClick={() => {
                  setNavOpen(!navOpen);
                }}
              >
                {!navOpen ? <IconMenu2 /> : <IconX />}
              </ActionIcon>
            </div>
            <div className="flex justify-center items-center">
              <Link to={"/"}>
                <img
                  src={websiteLogo}
                  width={128}
                  alt="Logo"
                  className="w-32"
                />
              </Link>
            </div>
            <div className="sm:block hidden">
              <Group className="h-14 gap-0">
                <Link
                  to={"/"}
                  className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                    location === "" ? "font-semibold text-orange-600" : ""
                  }`}
                >
                  หน้าหลัก
                </Link>

                <Link
                  to={"/books"}
                  className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                    location === "books" ? "font-semibold text-orange-600" : ""
                  }`}
                >
                  หนังสือ
                </Link>

                <Link
                  to={"/menus"}
                  className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                    location === "menus" ? "font-semibold text-orange-600" : ""
                  }`}
                >
                  เมนู
                </Link>
                {isAuth.isAuth && (
                  <Link
                    to={"/orders"}
                    className={`flex items-center h-14 px-1 no-underline text-neutral-600 text-md ${
                      location === "orders"
                        ? "font-semibold text-orange-600"
                        : ""
                    }`}
                  >
                    ออเดอร์
                  </Link>
                )}
                <Button
                  size="xs"
                  onClick={() => {
                    setIsAuth({ isAuth: !isAuth.isAuth });
                  }}
                >
                  {isAuth.isAuth ? "เข้า Guest Mode" : "เข้า Admin Mode"}
                </Button>
              </Group>
            </div>

            <div></div>
          </div>
        </header>
      </Box>

      <main>{children}</main>
    </>
  );
}
