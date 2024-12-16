"use client"

import { Charts } from "@/components";
import { MenuItems } from "@/components/Layout/constants";
import { Breadcrumb } from "antd";

export default function ChartsPage() {
  return (
    <div>
      <Breadcrumb items={[
          {breadcrumbName: "home", title: "Главная"},
          {breadcrumbName: MenuItems.CHART.key, title: MenuItems.CHART.label},
        ]} style={{marginBottom: 24}} />
      <Charts />
    </div>
  );
}
