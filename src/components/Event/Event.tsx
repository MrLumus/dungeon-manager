"use client"

import { ICharacter, IEvent } from "@/types/dm_data";
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Dropdown, Form, Input, Menu, message, Popconfirm, Table } from 'antd';
import { useUnit } from "effector-react";
import { $dmData, addCharacterToEvent, handleChangeEventCharacterExp, removeCharacterFromEvent } from "@/models/dm_dataModel";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  expGain: string;
  startExp: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  name: string;
  expGain: string;
  startExp: string;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

export const Event = ({adventureKey, event}: {adventureKey: string; event: IEvent}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dmData = useUnit($dmData);
  const characters = dmData?.characters;

  const handleDelete = (key: React.Key) => {
    removeCharacterFromEvent({
      characterKey: key.toString(),
      adventureKey,
      eventKey: event.key
    })
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Имя',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'Начальный опыт',
      dataIndex: 'startExp',
    },
    {
      title: 'Полученный опыт',
      dataIndex: 'expGain',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) =>
        event.characters.length >= 1 ? (
          <Popconfirm
            title="Вы точно хотите удалить персонажа из события? Его опыт будет пересчитан"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Удалить</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = (character: ICharacter | null) => {
    if (!character) return;

    addCharacterToEvent({character, adventureKey, eventKey: event.key});
  };

  const handleSave = (row: DataType) => {
    const isNumber = !isNaN(Number(row.expGain));

    if (!isNumber) {
      messageApi.error("Введите число!");
    }

    handleChangeEventCharacterExp({
      adventureKey,
      characterKey: row.key.toString(),
      eventKey: event.key,
      exp: Number(row.expGain)
    })
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const characterButtonList = characters?.map(character => ({
    key: character.key,
    label: character.label,
    disabled: function(){
      let hasCharacter = false;
      event.characters.forEach(eventCharacter => {
        if (character.key === eventCharacter.key) hasCharacter = true
      })

      return hasCharacter
    }()
  })) ?? []

  return (
    <div>
      <Dropdown
        menu={{
          items: characterButtonList,
          onClick: (e) => {
            const character = characters?.filter(character => character.key === e.key)?.[0] ?? null;
            handleAdd(character);
          }
        }}
      >
        <Button>Добавить персонажа</Button>
      </Dropdown>
      <Table<DataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={event.characters.map(char => ({
          key: char.key,
          name: char.label,
          expGain: char.expGain.toString(),
          startExp: char.startExp.toString()
        }))}
        columns={columns as ColumnTypes}
        style={{
          marginTop: 16
        }}
      />
      {contextHolder}
    </div>
  )
}
