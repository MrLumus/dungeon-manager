export interface ICharacter {
  key: string;
  label: string;
  startExp: number;
  totalExp: number;
  color?: string;
  adventures: Array<{
    key: string;
    label: string;
    expGain: number;
    startExp: number;
  }>
}

export interface IEvent {
  key: string;
  label: string;
  description: string;
  characters: Array<{
    key: string;
    label: string;
    expGain: number;
    startExp: number;
  }>
}

export interface IAdventure {
  key: string;
  label: string;
  description: string;
  events: Array<IEvent>;
}

export interface IDmData {
  characters: Array<ICharacter>;
  adventures: Array<IAdventure>;
};
