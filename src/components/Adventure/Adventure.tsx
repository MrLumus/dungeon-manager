"use client"

import { IAdventure } from "@/types/dm_data";
import { Button, Collapse, Input, Modal, Typography } from "antd";
import { NoData } from "../NoData";
import { $dmData, addNewEvent, updateEventName } from "@/models/dm_dataModel";
import { SettingOutlined } from "@ant-design/icons";
import { useUnit } from "effector-react";
import { useState } from "react";
import { Event } from "../Event";

const ModalEditEvent = ({
  adventureKey,
  eventKey,
  isOpen,
  handleOk,
  handleCancel
}: {
  adventureKey: string;
  eventKey: string;
  isOpen: boolean;
  handleOk: ({adventureKey, eventKey, name}: {adventureKey: string; eventKey: string; name: string}) => void;
  handleCancel: () => void;
}) => {
  if (!isOpen) return null;

  const dmData = useUnit($dmData);

  if (!dmData) return null;

  const adventure = dmData.adventures.filter(adventure => adventure.key === adventureKey)?.[0];

  if (!adventure) return null;

  const event = adventure.events.filter(event => event.key === eventKey)?.[0];

  if (!event) return null;

  const [name, setName] = useState<string>(event.label);

  return <Modal title="Редактирование" open={isOpen} onOk={() => {
    handleOk({adventureKey, eventKey, name});
  }} onCancel={handleCancel}>
    <Input placeholder="Введите название события" value={name} onChange={(event) => setName(event.target.value)} />
  </Modal>
}

const genExtra = (onClick: () =>  void) => (
  <SettingOutlined
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
  />
);

export const Adventure = ({adventure}: {adventure: IAdventure}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentKey, setCurrentKey] = useState<string>("");

  if (!adventure) return null;

  return (
    <div>
      <Typography.Title level={4}>Список событий</Typography.Title>
      <ModalEditEvent
        isOpen={isModalOpen}
        adventureKey={adventure.key}
        eventKey={currentKey}
        handleCancel={() => setModalOpen(false)}
        handleOk={({adventureKey, eventKey, name}) => {
          updateEventName({
            adventureKey,
            eventKey,
            name
          });
          setModalOpen(false);
        }}
      />
      {!adventure.events.length && <NoData entityType="event" adventureKey={adventure.key} />}
      {!!adventure.events.length && (
        <div>
          <Collapse
            items={adventure.events.map(event => ({
              key: event.key,
              label: event.label,
              children: <Event adventureKey={adventure.key} event={event} />,
              extra: genExtra(() => {
                setCurrentKey(event.key);
                setModalOpen(true);
              })
            }))}
          />
          <Button
            type="primary"
            style={{marginTop: 16}}
            onClick={() => addNewEvent(adventure.key)}
          >Добавить событие</Button>
        </div>
      )}
    </div>
  )
};
