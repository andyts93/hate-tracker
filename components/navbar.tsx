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
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { HeartFilledIcon, Logo } from "@/components/icons";
import { setUserLocale } from "@/services/locale";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const t = useTranslations("Menu");
  const locale = useLocale();
  const { data: session } = useSession();

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
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
            <DropdownItem onClick={() => setUserLocale("en")}>
              <span className="fi fi-gb mr-2" /> English
            </DropdownItem>
            <DropdownItem onClick={() => setUserLocale("it")}>
              <span className="fi fi-it mr-2" /> Italiano
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch /> */}
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
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {session && (
            <>
              <NavbarMenuItem>
                <Link
                  color="foreground"
                  href={"/profile"}
                  size="lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("profile")}
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="foreground" size="lg" onClick={() => signOut()}>
                  {t("logout")}
                </Link>
              </NavbarMenuItem>
            </>
          )}
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
                <span className={`fi fi-${locale === "en" ? "gb" : locale}`} />
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
              <DropdownItem onClick={() => setUserLocale("en")}>
                <span className="fi fi-gb mr-2" /> English
              </DropdownItem>
              <DropdownItem onClick={() => setUserLocale("it")}>
                <span className="fi fi-it mr-2" /> Italiano
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
