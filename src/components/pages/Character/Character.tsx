"use client"

import { $dmData } from "@/models/dm_dataModel";
import { Breadcrumb, Table, Typography } from "antd";
import { useUnit } from "effector-react";
import { useParams } from "next/navigation"
import { MenuItems } from "../../Layout/constants";
import { useEffect, useState } from "react";

export const CharacterPageComponent = () => {
  const {key} = useParams<{ key: string }>();
  const dmData = useUnit($dmData);

  if (!dmData) return null;

  const character = dmData.characters.filter(character => character.key === key)?.[0];
  
  if (!character) return null;

  const columns = [
    {
      title: "Событие",
      dataIndex: "eventName",
      key: "eventName",
      width: "33%"
    },
    {
      title: "Начальный опыт",
      dataIndex: "startExp",
      key: "startExp",
      width: "33%"
    },
    {
      title: "Полученный опыт",
      dataIndex: "expGain",
      key: "expGain"
    },
  ]

  let characterAdventures: {
    [x: string]: {
      index: number;
      events: {
        [x: string]: {
          index: number;
          expGain: number;
          startExp: number;
        }
      }
    }
  } = {}

  dmData.adventures.forEach((adventure, advIdx) => {
    adventure.events.forEach((event, eventIdx) => {
      event.characters.forEach(eventChar => {
        if (eventChar.key !== character.key) return;

        if (!characterAdventures[adventure.label]) {
          characterAdventures[adventure.label] = {
            index: advIdx,
            events: {}
          };
        }

        characterAdventures[adventure.label].events[event.label] = {
          index: eventIdx,
          startExp: eventChar.startExp,
          expGain: eventChar.expGain
        }
      })
    })
  })

  return (
    <div>
      <Breadcrumb items={[
          {breadcrumbName: "home", title: "Главная"},
          {breadcrumbName: MenuItems.CHARACTERS.key, title: MenuItems.CHARACTERS.label},
          {breadcrumbName: character.key, title: character.label},
      ]} style={{marginBottom: 24}} />

      <Typography.Title>Персонаж "{character.label}"</Typography.Title>

      <div style={{display: "flex", flexDirection: "column", gap: 16}}>
        {Object.entries(characterAdventures)
          .sort(([name, value], [name2, value2]) => value.index - value2.index)
          .map(([arcName, arcValue]) => (
            <>
              <Typography.Title level={4}>{arcName}</Typography.Title>
              <div>
                <Table columns={columns} dataSource={
                  Object.entries(arcValue.events)
                  .sort(([name, value], [name2, value2]) => value.index - value2.index)
                  .map(([eventName, eventValue]) => ({
                    key: eventValue.index,
                    eventName,
                    startExp: eventValue.startExp,
                    expGain: eventValue.expGain
                  }))
                } />
              </div>
            </>
        ))}
      </div>
    </div>
  )
}
