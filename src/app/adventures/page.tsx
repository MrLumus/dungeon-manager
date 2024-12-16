"use client"

import { Adventures } from "@/components";
import { MenuItems } from "@/components/Layout/constants";
import { Breadcrumb } from "antd";

export default function AdventuresPage() {
  return (
    <div>
      <Breadcrumb items={[
          {breadcrumbName: "home", title: "Главная"},
          {breadcrumbName: MenuItems.ADVENTURES.key, title: MenuItems.ADVENTURES.label},
        ]} style={{marginBottom: 24}} />
      <Adventures />
    </div>
  );
}
