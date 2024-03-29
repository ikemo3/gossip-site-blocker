import { $ } from "./dom";

interface OptionOptions {
  value: string;
  message: string;
}

interface SelectOptions {
  options: OptionOptions[];
  selectedValue: string;
  onChange: EventListenerOrEventListenerObject;
}

export function createSelectOption(dict: SelectOptions): HTMLSelectElement {
  const select = document.createElement("select");
  const { options, onChange, selectedValue } = dict;
  for (const option of options) {
    const optionElement: HTMLOptionElement = $.option(
      option.value,
      option.message,
    );
    select.appendChild(optionElement);
  }

  select.addEventListener("change", onChange);
  select.value = selectedValue;

  return select;
}
