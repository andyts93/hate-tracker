"use client";

import "flag-icons/css/flag-icons.min.css";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import { siteConfig } from "@/config/site";
import { HeartFilledIcon, Logo } from "@/components/icons";
import { setUserLocale } from "@/services/locale";

export const Navbar = () => {
  //   const heart1 = document.createElement("img");

  // heart1.src = "/heart-1.png";
  // const heart2 = document.createElement("img");

  // heart2.src = "/heart-2.png";
  // const heart3 = document.createElement("img");

  // heart3.src = "/heart-3.png";
  // const rose1 = document.createElement("img");

  // rose1.src = "/rose-1.png";
  // const rose2 = document.createElement("img");

  // rose2.src = "/rose-2.png";

  // const heart4 = document.createElement("img");

  // heart4.src = "/choco-heart-1.png";
  // const heart5 = document.createElement("img");

  // heart5.src = "/choco-heart-2.png";
  // const heart6 = document.createElement("img");

  // heart6.src = "/choco-heart-3.png";

  // const heart7 = document.createElement("img");

  // heart7.src = "/balloon-heart-1.png";
  // const heart8 = document.createElement("img");

  // heart8.src = "/balloon-heart-2.png";
  // const heart9 = document.createElement("img");

  // heart9.src = "/balloon-heart-3.png";

  // const allImages = [
  //   [heart1, heart2, heart3],
  //   [rose1, rose2],
  //   [heart4, heart5, heart6],
  //   [heart7, heart8, heart9],
  // ];
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const t = useTranslations("Menu");
  const locale = useLocale();
  // const [images, setImages] = useState<CanvasImageSource[]>(allImages[0]);
  // const [snowCount, setSnowCount] = useState<number>(80);
  // const lastIndex = useRef(0);

  // const getRandomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);
  // const getRandomNumber = (min: number, max: number) =>
  //   Math.floor(Math.random() * (max - min + 1)) + min;

  // const changeEffect = () => {
  //   let newIndex = getRandomIndex(allImages);

  //   if (newIndex === lastIndex.current) {
  //     newIndex = getRandomIndex(allImages);
  //   }
  //   lastIndex.current = newIndex;
  //   setImages(allImages[lastIndex.current]);
  //   setSnowCount(getRandomNumber(30, 100));
  // };

  return (
    <>
      {/* <SnowfallComponent images={images} snowflakeCount={snowCount} /> */}
      <NextUINavbar
        isMenuOpen={isMenuOpen}
        maxWidth="xl"
        position="sticky"
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo fill="#ec4899" />
              <p className="font-bold text-inherit uppercase">Heartwave</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {t(item.label)}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            {/* <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch /> */}
          </NavbarItem>
          {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
          <NavbarItem className="hidden md:flex">
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              startContent={<HeartFilledIcon className="text-danger" />}
              variant="flat"
            >
              Sponsor
            </Button>
          </NavbarItem>
          <Dropdown>
            <NavbarItem className="flex items-center">
              <DropdownTrigger>
                <span className={`fi fi-${locale === "en" ? "gb" : locale}`} />
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
              <DropdownItem key={"english"} onClick={() => setUserLocale("en")}>
                <span className="fi fi-gb mr-2" /> English
              </DropdownItem>
              <DropdownItem key={"italian"} onClick={() => setUserLocale("it")}>
                <span className="fi fi-it mr-2" /> Italiano
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* <Button onClick={() => changeEffect()}>Click me</Button> */}
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          {/* <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch /> */}
          {/* <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button> */}
          {/* <Button onClick={() => changeEffect()}>Click me</Button> */}
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          {/* {searchInput} */}
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === siteConfig.navMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  href={item.href}
                  size="lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.label)}
                </Link>
              </NavbarMenuItem>
            ))}
            <Dropdown>
              <NavbarItem className="flex items-center">
                <DropdownTrigger>
                  <span
                    className={`fi fi-${locale === "en" ? "gb" : locale}`}
                  />
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu>
                <DropdownItem
                  key={"english"}
                  onClick={() => setUserLocale("en")}
                >
                  <span className="fi fi-gb mr-2" /> English
                </DropdownItem>
                <DropdownItem
                  key={"italian"}
                  onClick={() => setUserLocale("it")}
                >
                  <span className="fi fi-it mr-2" /> Italiano
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
};
