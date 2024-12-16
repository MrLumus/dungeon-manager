"use client"

import { $dmData, addNewAdventure, updateAdventureName } from "@/models/dm_dataModel"
import { Collapse, Input, Modal, Typography } from "antd"
import { useUnit } from "effector-react"
import { NoData } from "../NoData";
import styled from "styled-components";
import { PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { blue } from "@ant-design/colors";
import { Adventure } from "../Adventure";
import Title from "antd/es/skeleton/Title";
import { useState } from "react";

const MainContainer = styled.div`
  display: grid;
  grid-template-rows: auto 60px;
  gap: 16px;
`;

const AddAdventureContainer = styled.div`
  width: 100%;
  height: 60px;
  text-align: center;
`;

const CreateAdventure = () => {
  return (
    <AddAdventureContainer>
      <PlusCircleOutlined
        style={{
          fontSize: 32,
          cursor: "pointer",
          color: blue.primary
        }}
        onClick={() => addNewAdventure()}
      />
    </AddAdventureContainer>
  )
}

const ModalEditAdventure = ({
  adventureKey,
  isOpen,
  handleOk,
  handleCancel
}: {
  adventureKey: string;
  isOpen: boolean;
  handleOk: ({key, name}: {key: string, name: string}) => void;
  handleCancel: () => void;
}) => {
  if (!isOpen) return null;

  const dmData = useUnit($dmData);

  if (!dmData) return null;

  const adventure = dmData.adventures.filter(adventure => adventure.key === adventureKey)?.[0];

  if (!adventure) return null;

  const [name, setName] = useState<string>(adventure.label);

  return <Modal title="Редактирование" open={isOpen} onOk={() => {
    handleOk({key: adventureKey, name});
  }} onCancel={handleCancel}>
    <Input placeholder="Введите название арки" value={name} onChange={(event) => setName(event.target.value)} />
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

export const Adventures = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentKey, setCurrentKey] = useState<string>("");
  const dmData = useUnit($dmData);

  return (
    <div>
      <Typography.Title>Список арок</Typography.Title>
      <ModalEditAdventure
        adventureKey={currentKey}
        isOpen={isModalOpen}
        handleCancel={() => setModalOpen(false)}
        handleOk={({key, name}) => {
          updateAdventureName({
            key,
            name
          });
          setModalOpen(false);
        }}
      />
      {!dmData?.adventures?.length && <NoData entityType="adventure" />}
      {dmData?.adventures?.length && (
        <MainContainer>
          <Collapse
            items={dmData.adventures.map(adventure => ({
              key: adventure.key,
              label: adventure.label,
              children: <Adventure adventure={adventure} />,
              extra: genExtra(() => {
                setCurrentKey(adventure.key);
                setModalOpen(true);
              })
            }))}
            size="large"
          />
          <CreateAdventure />
        </MainContainer>
      )}
    </div>
  )
}
