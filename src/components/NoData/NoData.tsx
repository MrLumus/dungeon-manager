"use client"

import { addNewAdventure, addNewCharacter, addNewEvent } from "@/models/dm_dataModel";
import { Button, Empty, Typography } from "antd";

type Props = {
  entityType: "character" | "adventure" | "event";
  adventureKey?: string;
}

export const NoData = ({entityType, adventureKey}: Props) => {
  const handleCreate = () => {
    switch(entityType) {
      case "character":
        addNewCharacter();
        break;
      case "adventure":
        addNewAdventure();
        break;
      case "event":
        addNewEvent(adventureKey ?? "");
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <Empty
        description={
          <Typography.Text>
            В справочнике отсутствуют записи
          </Typography.Text>
        }
      >
        <Button type="primary" onClick={handleCreate}>Создать запись</Button>
      </Empty>
    </div>
  )
}
