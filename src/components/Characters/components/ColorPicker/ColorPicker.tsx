import { updateCharacterColor } from "@/models/dm_dataModel"
import { ICharacter } from "@/types/dm_data"
import { blue, gold, lime, purple, red } from "@ant-design/colors";
import { Button } from "antd";
import styled from "styled-components";

const ColorPick = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 1000;
`;

const ColorCell = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  border-radius: 50%;
  background: white;
  cursor: pointer;
`;

const RowColors = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 22px);
  gap: 16px;
`;

const GridColors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const ColorPicker = ({
  opened,
  character,
  onClick
}: {
  opened: boolean,
  character: ICharacter,
  onClick: (value: boolean) => void;
}) => {
  const handleChangeColor = (color: string) => {
    updateCharacterColor({
      key: character.key,
      color
    })
  }

  const selectedColor = (color: string) => ({
    border: (color === "#FFF" && !character.color) ? "2px solid #2A2" : (color === character.color) ? "2px solid #2A2" : "1px solid #000",
    background: color ?? "#FFF"
  })

  return (
    <ColorPick onClick={() => onClick(!opened)}>
      {opened && (
        // red, gold, lime, yellow, blue, purple 
        <GridColors>
          <RowColors>
            <ColorCell style={{...selectedColor("#FFF")}} onClick={() => handleChangeColor("#FFF")} />
            <ColorCell style={{...selectedColor(red[1])}} onClick={() => handleChangeColor(red[1])} />
            <ColorCell style={{...selectedColor(gold[1])}} onClick={() => handleChangeColor(gold[1])} />
          </RowColors>
          <RowColors>
            <ColorCell style={{...selectedColor(lime[1])}} onClick={() => handleChangeColor(lime[1])} />
            <ColorCell style={{...selectedColor(purple[1])}} onClick={() => handleChangeColor(purple[1])} />
            <ColorCell style={{...selectedColor(blue[1])}} onClick={() => handleChangeColor(blue[1])} />
          </RowColors>
        </GridColors>
      )}
      <Button>Цвет</Button>
    </ColorPick>
  )
}