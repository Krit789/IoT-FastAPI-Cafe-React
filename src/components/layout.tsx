import { Box, Group, ActionIcon } from "@mantine/core";
import websiteLogo from "../assets/iotcafe_logo.svg";
import { Link, useLocation } from "react-router-dom";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const location = useLocation().pathname.split("/")[1];
  return (
    <>
      <Box>
        <header className="h-14 border fixed w-full bg-transparent z-50">
            <div className={`absolute top-[67px] bg-gray-100/70 backdrop-blur-md pl-4 pr-20 sm:hidden block rounded-br-md transition-all ${navOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
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
                <img src={websiteLogo} width={128} alt="Logo" className="w-32" />
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
