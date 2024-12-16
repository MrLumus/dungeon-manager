"use client"

import { AreaChartOutlined, DownloadOutlined, GlobalOutlined, LeftOutlined, RightOutlined, UploadOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Menu, MenuProps } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { MenuItems } from "./constants";
import { IDmData } from "@/types/dm_data";
import { $dmData, SetDmData } from "@/models/dm_dataModel";
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useUnit } from "effector-react";

export const AppLayout = ({children}: PropsWithChildren) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const dmData = useUnit($dmData);
  const inputRef = useRef<HTMLInputElement>(null);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  }

  useEffect(() => {
    const initializeDmData = async () => {
      if (!localStorage.getItem("dm_data")) {
        localStorage.setItem(
          "dm_data",
          JSON.stringify({ characters: [], adventures: [] })
        );
      }
  
      const dm_data_json =
        localStorage.getItem("dm_data") ?? JSON.stringify({ characters: [], adventures: [] });
      const dm_data: IDmData = JSON.parse(dm_data_json);
  
      SetDmData(dm_data);
    };
  
    initializeDmData();
  }, [])

  const downloadJsonFile = () => {
    const fileName = 'exported_data.json';

    const jsonString = JSON.stringify(dmData);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleInputClick = () => {
    inputRef.current?.click();
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const content = reader.result;
        const parsedData: IDmData = JSON.parse(content as string);
        SetDmData(parsedData);
        localStorage.setItem("dm_data", content as string)
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Ошибка при чтении файла:", error);
    }
  };

  const menuProps: MenuProps['items'] = [
    {
      key: MenuItems.ADVENTURES.key,
      icon: React.createElement(GlobalOutlined),
      label: MenuItems.ADVENTURES.label,
      children: [
        {
          key: MenuItems.ADVENTURES.root.key,
          label: (
            <Link href="/adventures">{MenuItems.ADVENTURES.root.label}</Link>
          ),
        },
        ...(dmData?.adventures.map(adventure => (
          {
            key: adventure.key,
            label: (
              <Link href={`/adventures/${adventure.key}`}>{adventure.label}</Link>
            )
          }
        )) ?? [])
      ]
    },
    {
      key: MenuItems.CHARACTERS.key,
      icon: React.createElement(UsergroupAddOutlined),
      label: MenuItems.CHARACTERS.label,
      children: [
        {
          key: MenuItems.CHARACTERS.root.key,
          label: (
            <Link href="/characters">{MenuItems.CHARACTERS.root.label}</Link>
          )
        },
        ...(dmData?.characters.map(character => (
          {
            key: character.key,
            label: (
              <Link href={`/characters/${character.key}`}>{character.label}</Link>
            )
          }
        )) ?? [])
      ]
    },
    {
      key: MenuItems.CHART.key,
      icon: React.createElement(AreaChartOutlined),
      label: (
        <Link href={`/charts`}>{MenuItems.CHART.label}</Link>
      )
    },
    {
      key: "jsonImport",
      icon: React.createElement(UploadOutlined),
      label: (
        <>
          <input
            ref={inputRef}
            type="file"
            onChange={handleFileUpload}
            hidden
          />
          <span onClick={handleInputClick}>Импорт JSON</span>
        </>
      ),
      style: {
        marginTop: 48
      }
    },
    {
      key: "jsonExport",
      icon: React.createElement(DownloadOutlined),
      label: "Экспорт JSON",
      onClick: downloadJsonFile,
    },
    {
      key: "collapse",
      icon: React.createElement(collapsed ? RightOutlined : LeftOutlined),
      label: collapsed ? "Раскрыть" : "Скрыть",
    },
  ]

  return (
    <StyleProvider cache={cache}>
      <Layout style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
        <Content style={{ padding: '0 48px',flex: 1 }}>
          <Layout
            style={{ padding: '24px 0', height: "100%" }}
          >
            <Sider width={200} collapsed={collapsed} style={{background: "none"}}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[MenuItems.ADVENTURES.root.key]}
                defaultOpenKeys={[MenuItems.ADVENTURES.key]}
                style={{ maxHeight: 'min-content' }}
                items={menuProps}
                onClick={({ key }) => {
                  if (key === "collapse") toggleCollapse();
                }}
              />
            </Sider>
            <Content style={{ padding: '0 24px', height: "calc(100vh - 169px)" }}>
              <Card style={{height: "100%", overflow: "auto"}}>
                {children}
              </Card>
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          DungeonManager ©{new Date().getFullYear()} Created by <Link target="_blank" href="https://t.me/MrLumus">@MrLumus</Link>
        </Footer>
      </Layout>
    </StyleProvider>
  )
}