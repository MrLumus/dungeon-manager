"use client"

import { $dmData, addNewCharacter } from "@/models/dm_dataModel"
import { Typography } from "antd"
import { useUnit } from "effector-react"
import { NoData } from "../NoData"
import { Character } from "./components"
import styled from "styled-components"
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { blue, gray } from "@ant-design/colors"

const AddCharacterContainer = styled.div`
  width: 300px;
  height: 100%;
  display: flex;
  justify-content: center;
  aligh-items: center;
`

const CreateCharacter = () => {
  return (
    <AddCharacterContainer>
      <PlusCircleOutlined
        style={{
          fontSize: 48,
          cursor: "pointer",
          color: blue.primary
        }}
        onClick={() => addNewCharacter()}
      />
    </AddCharacterContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
`;

export const Characters = () => {
  const dmData = useUnit($dmData);

  return (
    <div>
      <Typography.Title>Список персонажей</Typography.Title>
      {!dmData?.characters?.length && <NoData entityType="character" />}
      {dmData?.characters?.length && (
        <StyledContainer>
          {dmData?.characters?.map(character => (
            <Character key={character.key} character={character} />
          ))}
          <CreateCharacter />
        </StyledContainer>
      )}
    </div>
  )
}