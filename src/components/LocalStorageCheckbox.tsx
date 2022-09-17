import { useReducer } from "react";

type CheckboxState = {
  version: number;
  values: Record<string, boolean>;
};

const LS_KEY = "checkboxState";

function getCheckboxState(): CheckboxState {
  const rawState = localStorage.getItem(LS_KEY);
  const state = rawState ? JSON.parse(rawState) : { version: 0, values: {} };

  return state;
}

function isChecked(key: string): boolean {
  return !!getCheckboxState().values[key];
}

function handleCheck(key: string, value: boolean): void {
  const state = getCheckboxState();

  localStorage.setItem(
    LS_KEY,
    JSON.stringify({
      ...state,
      values: {
        ...state.values,
        [key]: value,
      },
    })
  );
}

export type LocalStorageCheckboxProps = {
  itemKey: string;
  className?: string;
};

export const LocalStorageCheckbox = ({
  itemKey,
  className = "",
}: LocalStorageCheckboxProps) => {
  const [_, forceRender] = useReducer((s) => s + 1, 0);

  return (
    <input
      className={className}
      type="checkbox"
      checked={isChecked(itemKey)}
      onChange={() => {
        handleCheck(itemKey, !isChecked(itemKey));
        forceRender();
      }}
    />
  );
};
