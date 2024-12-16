import { IAdventure, ICharacter, IDmData, IEvent } from "@/types/dm_data";
import { createEffect, createEvent, createStore, sample } from "effector";
import moment from "moment";

export const SetDmData = createEvent<IDmData>();

export const addNewCharacter = createEvent();

const addNewCharacterFx = createEffect<void, ICharacter>(() => {
  const timestamp = moment().unix();

  return  {
    key: `newCharacter_${timestamp}`,
    label: "Новый персонаж",
    startExp: 0,
    totalExp: 0,
    adventures: []
  };
});

export const addNewAdventure = createEvent();

const addNewAdventureFx = createEffect<void, IAdventure>(() => {
  const timestamp = moment().unix();

  return {
    key: `newAdventure_${timestamp}`,
    label: "Новая арка",
    description: "",
    events: []
  };
});

export const addNewEvent = createEvent<string>();

const addNewEventFx = createEffect<string, IEvent & {adventureKey: string}>((adventureKey) => {
  const timestamp = moment().unix();

  return {
    key: `newEvent_${timestamp}`,
    label: "Новое событие",
    description: "",
    characters: [],
    adventureKey
  };
});

export const updateCharacterColor = createEvent<{key: string; color: string}>();

const updateCharacterColorFx = createEffect<{key: string; color: string}, {key: string; color: string}>(
  ({key, color}) => ({
    key,
    color
  })
);

export const updateCharacterStartExp = createEvent<{key: string; exp: number}>();
const updateCharacterStartExpFx = createEffect<{key: string; exp: number}, {key: string; exp: number}>(
  ({key, exp}) => ({
    key,
    exp
  })
)

export const updateCharacterTotalExp = createEvent<{key: string; exp: number}>();
const updateCharacterTotalExpFx = createEffect<{key: string; exp: number}, {key: string; exp: number}>(
  ({key, exp}) => ({
    key,
    exp
  })
)

export const updateCharacterName = createEvent<{key: string; name: string}>();
const updateCharacterNameFx = createEffect<{key: string; name: string}, {key: string; name: string}>(
  ({key, name}) => ({
    key,
    name
  })
)

export const updateAdventureName = createEvent<{key: string; name: string}>();
const updateAdventureNameFx = createEffect<{key: string; name: string}, {key: string; name: string}>(
  ({key, name}) => ({
    key,
    name
  })
)

export const updateEventName = createEvent<{adventureKey: string; eventKey: string; name: string}>();
const updateEventNameFx = createEffect<{
  adventureKey: string;
  eventKey: string;
  name: string
}, {
  adventureKey: string;
  eventKey: string;
  name: string
}>(
  ({adventureKey, eventKey, name}) => ({
    adventureKey,
    eventKey,
    name
  })
)

export const removeCharacter = createEvent<{key: string}>();
const removeCharacterFx = createEffect<{key: string}, {key: string}>(
  ({key}) => ({
    key,
  })
)

export const addCharacterToEvent = createEvent<{character: ICharacter; adventureKey: string; eventKey: string}>();
const addCharacterToEventFx = createEffect<{
  character: ICharacter;
  adventureKey: string;
  eventKey: string
}, {
  character: ICharacter;
  adventureKey: string;
  eventKey: string
}>(
  ({character, adventureKey, eventKey}) => ({
    character,
    adventureKey,
    eventKey
  })
)

export const removeCharacterFromEvent = createEvent<{characterKey: string; adventureKey: string; eventKey: string}>();
const removeCharacterFromEventFx = createEffect<{
  characterKey: string;
  adventureKey: string;
  eventKey: string
}, {
  characterKey: string;
  adventureKey: string;
  eventKey: string
}>(
  ({characterKey, adventureKey, eventKey}) => ({
    characterKey,
    adventureKey,
    eventKey
  })
)

export const handleChangeEventCharacterExp = createEvent<{characterKey: string; adventureKey: string; eventKey: string; exp: number}>();
const handleChangeEventCharacterExpFx = createEffect<{
  characterKey: string;
  adventureKey: string;
  eventKey: string;
  exp: number;
}, {
  characterKey: string;
  adventureKey: string;
  eventKey: string;
  exp: number;
}>(
  ({characterKey, adventureKey, eventKey, exp}) => ({
    characterKey,
    adventureKey,
    eventKey,
    exp
  })
)

export const updateCharacterInitialExp = createEvent<{characterKey: string; exp: number}>();
const updateCharacterInitialExpFx = createEffect<{
  characterKey: string;
  exp: number;
}, {
  characterKey: string;
  exp: number;
}>(
  ({characterKey, exp}) => ({
    characterKey,
    exp
  })
)

export const $dmData = createStore<IDmData | null>(null)
  .on(addNewCharacterFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));

    updState.characters.push(payload);

    localStorage.setItem("dm_data", JSON.stringify(updState));

    return updState;
  })
  .on(addNewAdventureFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));

    updState.adventures.push(payload);

    localStorage.setItem("dm_data", JSON.stringify(updState));

    return updState;
  })
  .on(addNewEventFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));

    updState.adventures.forEach(adventure => {
      if (adventure.key !== payload.adventureKey) return;

      adventure.events.push({
        key: payload.key,
        label: payload.label,
        description: payload.description,
        characters: payload.characters
      })
    })

    localStorage.setItem("dm_data", JSON.stringify(updState));

    return updState;
  })
  .on(updateCharacterColorFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const character = updState.characters.filter(char => char.key === payload.key)[0] ?? null;

    if (!character) return;

    character.color = payload.color;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(updateCharacterStartExpFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const character = updState.characters.filter(char => char.key === payload.key)[0] ?? null;

    if (!character) return;

    character.startExp = payload.exp;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(updateCharacterTotalExpFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const character = updState.characters.filter(char => char.key === payload.key)[0] ?? null;

    if (!character) return;

    character.totalExp = payload.exp;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(updateCharacterNameFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const character = updState.characters.filter(char => char.key === payload.key)[0] ?? null;

    if (!character) return;

    character.label = payload.name;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(updateCharacterInitialExpFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const character = updState.characters.filter(char => char.key === payload.characterKey)[0] ?? null;

    if (!character) return;

    character.startExp = payload.exp;
    character.totalExp = payload.exp;

    updState.adventures.forEach(adventure => {
      adventure.events.forEach(event => {
        event.characters.forEach(char => {
          if (char.key !== payload.characterKey) return;

          char.startExp = character.totalExp;
          character.totalExp += char.expGain;
        })
      })
    })

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(updateAdventureNameFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const adventure = updState.adventures.filter(adventure => adventure.key === payload.key)[0] ?? null;

    if (!adventure) return;

    adventure.label = payload.name;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(updateEventNameFx.doneData, (state, payload) => {
    const updState: IDmData = JSON.parse(JSON.stringify(state));
    const adventure = updState.adventures.filter(adventure => adventure.key === payload.adventureKey)[0] ?? null;

    if (!adventure) return;

    const event = adventure.events.filter(event => event.key === payload.eventKey)[0] ?? null;

    if (!event) return;

    event.label = payload.name;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(removeCharacterFx.doneData, (state, payload) => {
    let updState: IDmData = JSON.parse(JSON.stringify(state));

    const characters = updState.characters.filter(char => char.key !== payload.key);
    updState.characters = characters;

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(addCharacterToEventFx.doneData, (state, payload) => {
    let updState: IDmData = JSON.parse(JSON.stringify(state));

    const adventure = updState.adventures.filter(adventure => adventure.key === payload.adventureKey)?.[0] ?? null;

    if (!adventure) return;

    const event = adventure.events.filter(event => event.key === payload.eventKey)?.[0] ?? null;

    if (!event) return;

    const character = updState.characters.filter(char => char.key === payload.character.key)?.[0] ?? null;

    if (!character) return;

    event.characters.push({
      key: character.key,
      label: character.label,
      startExp: character.totalExp,
      expGain: 0
    })

    character.totalExp = character.startExp;

    updState.adventures.forEach(adventure => {
      adventure.events.forEach(event => {
        event.characters.forEach(char => {
          if (char.key !== character.key) return;

          char.startExp = character.totalExp;
          character.totalExp += char.expGain;
        })
      })
    })

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(handleChangeEventCharacterExpFx.doneData, (state, payload) => {
    let updState: IDmData = JSON.parse(JSON.stringify(state));

    const adventure = updState.adventures.filter(adventure => adventure.key === payload.adventureKey)?.[0] ?? null;

    if (!adventure) return;

    const event = adventure.events.filter(event => event.key === payload.eventKey)?.[0] ?? null;

    if (!event) return;

    const character = updState.characters.filter(char => char.key === payload.characterKey)?.[0] ?? null;

    if (!character) return;

    const eventCharacter = event.characters.filter(character => character.key === payload.characterKey)?.[0] ?? null;

    if (!eventCharacter) return;

    // character.totalExp = payload.exp + eventCharacter.startExp;
    eventCharacter.expGain = payload.exp;

    character.totalExp = character.startExp;

    updState.adventures.forEach(adventure => {
      adventure.events.forEach(event => {
        event.characters.forEach(char => {
          if (char.key !== character.key) return;

          char.startExp = character.totalExp;
          character.totalExp += char.expGain;
        })
      })
    })

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  })
  .on(removeCharacterFromEventFx.doneData, (state, payload) => {
    let updState: IDmData = JSON.parse(JSON.stringify(state));

    const adventure = updState.adventures.filter(adventure => adventure.key === payload.adventureKey)?.[0] ?? null;

    if (!adventure) return;

    const event = adventure.events.filter(event => event.key === payload.eventKey)?.[0] ?? null;

    if (!event) return;

    const character = updState.characters.filter(char => char.key === payload.characterKey)?.[0] ?? null;

    if (!character) return;

    const eventCharacter = event.characters.filter(character => character.key === payload.characterKey)?.[0] ?? null;

    if (!eventCharacter) return;

    // character.totalExp -= eventCharacter.expGain;
    character.totalExp = character.startExp;
    event.characters = event.characters.filter(character => character.key !== payload.characterKey);

    updState.adventures.forEach(adventure => {
      adventure.events.forEach(event => {
        event.characters.forEach(char => {
          if (char.key !== payload.characterKey) return;

          char.startExp = character.totalExp;
          character.totalExp += char.expGain;
        })
      })
    })

    localStorage.setItem("dm_data", JSON.stringify(updState));
    return updState;
  });;

sample({
  clock: SetDmData,
  target: $dmData
})

sample({
  clock: addNewCharacter,
  target: addNewCharacterFx
})

sample({
  clock: addNewAdventure,
  target: addNewAdventureFx
})

sample({
  clock: addNewEvent,
  target: addNewEventFx
})

sample({
  clock: updateCharacterColor,
  target: updateCharacterColorFx
})

sample({
  clock: updateCharacterStartExp,
  target: updateCharacterStartExpFx
})

sample({
  clock: updateCharacterTotalExp,
  target: updateCharacterTotalExpFx
})

sample({
  clock: updateCharacterName,
  target: updateCharacterNameFx
})

sample({
  clock: updateAdventureName,
  target: updateAdventureNameFx
})

sample({
  clock: updateEventName,
  target: updateEventNameFx
})

sample({
  clock: removeCharacter,
  target: removeCharacterFx
})

sample({
  clock: addCharacterToEvent,
  target: addCharacterToEventFx
})

sample({
  clock: handleChangeEventCharacterExp,
  target: handleChangeEventCharacterExpFx
})

sample({
  clock: removeCharacterFromEvent,
  target: removeCharacterFromEventFx
})

sample({
  clock: updateCharacterInitialExp,
  target: updateCharacterInitialExpFx
})