"use client"

import { $dmData, addNewEvent, updateEventName } from "@/models/dm_dataModel";
import { Breadcrumb, Button, Input, Modal, Typography } from "antd";
import { useUnit } from "effector-react";
import { useParams } from "next/navigation"
import { MenuItems } from "../../Layout/constants";
import { Event } from "@/components/Event";
import { useState } from "react";
import useMessage from "antd/es/message/useMessage";
import { EditFilled } from "@ant-design/icons";
import { IEvent } from "@/types/dm_data";

export const AdventurePageComponent = () => {
  const {key} = useParams<{ key: string }>();
  const dmData = useUnit($dmData);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [currentEventKey, setCurrentEventKey] = useState<string>("");
  const [messageApi, messageContenxt] = useMessage();

  if (!dmData) return null;

  const adventure = dmData.adventures.filter(adventure => adventure.key === key)?.[0];
  
  if (!adventure) return null;

  const handleAddEvent = () => {
    addNewEvent(adventure.key);
  }

  const handleEditEvent = (eventKey: string) => {
    if (!eventName) {
      return messageApi.error("Имя не может быть пустым");
    }

    updateEventName({
      adventureKey: adventure.key,
      eventKey: eventKey,
      name: eventName
    })
    
    messageApi.success("Имя события изменено");

    setModalOpen(false);
    setCurrentEventKey("");
    setEventName("");
  }

  return (
    <div>
      {messageContenxt}
      <Breadcrumb items={[
          {breadcrumbName: "home", title: "Главная"},
          {breadcrumbName: MenuItems.ADVENTURES.key, title: MenuItems.ADVENTURES.label},
          {breadcrumbName: adventure.key, title: adventure.label},
      ]} style={{marginBottom: 24}} />

      <Typography.Title>Арка "{adventure.label}"</Typography.Title>

      <div style={{display: "flex", flexDirection: "column", gap: 16}}>
        {adventure.events.map(event => (
          <div key={event.key}>
            <Typography.Title level={4}>
              {event.label} &nbsp;
              <EditFilled onClick={() => {
                setModalOpen(true);
                setEventName(event.label);
                setCurrentEventKey(event.key);
              }}
            />
            </Typography.Title>
            <Event adventureKey={adventure.key} event={event} />
          </div>
        ))}
      </div>

      <Button type="primary" style={{marginTop: 16}} onClick={handleAddEvent}>Добавить событие</Button>

      <Modal
        open={isModalOpen}
        onOk={() => {
          handleEditEvent(currentEventKey);
        }}
        onCancel={() => {
          setModalOpen(false);
          setEventName("");
          setCurrentEventKey("");
        }}
        title="Редактирование события"
      >
        <Input placeholder="Введите название события" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      </Modal>
    </div>
  )
}
