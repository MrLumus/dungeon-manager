"use client"

import { $dmData } from "@/models/dm_dataModel";
import { Select, Typography } from "antd"
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Charts = () => {
  const dmData = useUnit($dmData);
  const [currentAdventure, setCurrentAdventure] = useState<string | null>(dmData?.adventures[0]?.key || null);
  const [chartOptions, setChartOptions] = useState<any>({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    if (!dmData) return;
    if (!dmData.adventures.length) return;

    setCurrentAdventure(dmData.adventures[0].key);
  }, [dmData])

  useEffect(() => {
    if (!currentAdventure) return;
    if (!dmData || !dmData.adventures) return;

    const adventure = dmData.adventures.filter(adventure => adventure.key === currentAdventure)?.[0];

    if (!adventure) return;

    const updOptions = {
      labels: dmData?.characters.map(character => character.label),
      datasets: [
        {
          label: adventure.label,
          data: dmData.characters?.map(character => {
            let totalExp = 0;
  
            adventure.events.forEach(event => {
              event.characters.forEach(char => {
                if (char.key === character.key) {
                  totalExp += char.expGain;
                }
              })
            })
  
            return totalExp;
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
          ],
          borderWidth: 1
        },
      ],
    }

    setChartOptions(updOptions)

  }, [currentAdventure])

  if (!dmData) return (
    <div>
      <Typography.Title>Статистика</Typography.Title>
      Отсутствуют данные для отображения статистики
    </div>
  )

  let { adventures, characters } = dmData;

  if (!adventures.length || !characters.length) return (
    <div>
      <Typography.Title>Статистика</Typography.Title>
      Отсутствуют данные для отображения статистики
    </div>
  )

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Typography.Title>Статистика</Typography.Title>
      <Select 
        defaultValue={currentAdventure || dmData.adventures[0].key}
        options={dmData.adventures.map(adventure => ({
          value: adventure.key,
          label: adventure.label
        }))}
        onChange={setCurrentAdventure}
        style={{
          width: "20vw"
        }}
      />
      <Bar data={chartOptions} options={options} />;
    </div>
  )
}