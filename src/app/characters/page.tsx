"use client"

import { Characters } from "@/components";
import { MenuItems } from "@/components/Layout/constants";
import { Breadcrumb } from "antd";

export default function CharactersPage() {
  return (
    <div>
      <Breadcrumb items={[
          {breadcrumbName: "home", title: "Главная"},
          {breadcrumbName: MenuItems.CHARACTERS.key, title: MenuItems.CHARACTERS.label},
      ]} style={{marginBottom: 24}} />
      <Characters />
    </div>
  );
}
