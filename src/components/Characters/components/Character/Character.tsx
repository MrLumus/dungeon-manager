import { robotoBold } from "@/app/fonts";
import { ICharacter } from "@/types/dm_data";
import { canConvertToNumber, formattedNumber } from "@/utils";
import { gray } from "@ant-design/colors";
import { StarOutlined } from "@ant-design/icons";
import { Button, Card, Divider, message, Typography } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ColorPicker } from "../ColorPicker";
import { removeCharacter, updateCharacterInitialExp, updateCharacterName, updateCharacterStartExp, updateCharacterTotalExp } from "@/models/dm_dataModel";
import Image from "next/image";
import { EMPTY_PHOTO } from "@/app/constants";

const StyledContainer = styled(Card)`
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-color: ${gray[0]};
  position: relative;
`;

const RemoveButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 1000;
`;

export const Character = ({character}: {character: ICharacter}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [name, setName] = useState<string>(character.label);
  const [startExp, setStartExp] = useState<number>(character.startExp);
  const [colorPickOpen, setColorPickOpen] = useState<boolean>(false);

  const { Paragraph, Title } = Typography;

  const handleChangeName = (value: string) => {
    if (value === name) return;

    setName(value);

    updateCharacterName({
      key: character.key,
      name: value
    });

    messageApi.info(`Изменено имя с "${name}" на "${value}"`);
  }

  const handleChangeExp = (value: string) => {
    const prettierValue = value.split(" ").join("").split(" ").join("");

    if (!canConvertToNumber(prettierValue)) {
      messageApi.error("Опыт должен быть числом");
      return;
    }

    const parsedStartExp = Number(prettierValue);

    if (parsedStartExp < 0) {
      messageApi.error("Опыт не может быть меньше нуля");
      return;
    }

    if (parsedStartExp === startExp) return;

    setStartExp(Number(parsedStartExp));

    updateCharacterInitialExp({
      characterKey: character.key,
      exp: parsedStartExp
    })

    messageApi.info(`Начальный опыт изменен с ${formattedNumber(startExp)} на ${formattedNumber(parsedStartExp)}. Итоговый опыт будет пересчитан`);
  }

  return (
    <StyledContainer style={{background: character.color ?? "#FFF"}} cover={
      <Image
        src={EMPTY_PHOTO}
        alt="empty_photo"
        width={300}
        height={300}
        style={{
          borderLeft: `1px solid ${gray[1]}`,
          borderRight: `1px solid ${gray[1]}`,
          borderTop: `1px solid ${gray[1]}`,
        }}
      />
    } >
      {contextHolder}
      
      {/* <ColorPicker opened={colorPickOpen} character={character} onClick={setColorPickOpen} /> */}
      <RemoveButton>
        <Button type="text" danger onClick={() => {
          if (confirm(`Вы точно хотите удалить персонажа "${name}"`)) {
            removeCharacter({key: character.key})
          }
        }}>Удалить</Button>
      </RemoveButton>

      <Title style={{textAlign: "center"}} level={4} editable={{ onChange: handleChangeName }}>{name}</Title>
      <Divider />

      <div>
        <Paragraph className={robotoBold.className}>
          <StarOutlined /> ОПЫТ:
        </Paragraph>
        <div style={{paddingLeft: 16}}>
          <div style={{display: "flex", gap: 8, alignItems: "flex-start"}}>
            <span>Начальный:</span>
            <Paragraph editable={{
              onChange: handleChangeExp
            }} style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 0
            }}>
              {formattedNumber(startExp)}
            </Paragraph>
          </div>
          <div style={{display: "flex", gap: 8}}>
            <span>Итоговый:</span>
            <Paragraph
              // editable={{
              //   onChange: (value) => handleChangeExp({value, type: "totalExp"})
              // }}
            >
              {formattedNumber(character.totalExp)}
            </Paragraph>
          </div>
        </div>
      </div>
    </StyledContainer>
  )
}