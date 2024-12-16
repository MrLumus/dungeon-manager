"use client"

import { Breadcrumb } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Breadcrumb items={[
          {breadcrumbName: "home", title: "Главная"},
        ]}>
        </Breadcrumb>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <h1 style={{fontSize: 48}}>Dungeon Manager</h1>
          <p style={{fontSize: 24, textAlign: "center"}}>Добро пожаловать в менеджер прогресса <Link href="/characters">персонажей</Link> для Мастера Подземелий.<br /> Для начала работы создайте несколько персонжаей и можно приступать к списку <Link href="/adventures">арок</Link> и <Link href="/adventures">событий</Link></p>
          <p style={{fontSize: 24, color: "#0005"}}>Чтобы начать работу - выберите нужный пункт в меню слева</p>
        </div>
    </div>
  );
}
