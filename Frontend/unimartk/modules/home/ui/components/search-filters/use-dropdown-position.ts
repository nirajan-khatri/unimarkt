import { RefObject } from 'react';

export const useDropdownPosition = (
  ref:
    | RefObject<HTMLDivElement | null>
    | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240;

    // initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // check if dropdown goes out of the screen
    if (left + dropdownWidth > window.innerWidth) {
      // if it does, set it to the right of the button
      left = rect.right + window.scrollX - dropdownWidth;

      // check if it goes out of the screen
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }

    // check if dropdown goes out of the screen
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
