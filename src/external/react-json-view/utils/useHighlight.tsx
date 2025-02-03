import { useMemo, useRef, useEffect } from 'react';

function usePrevious<T>(value: T) {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface UseHighlight {
  value: any;
  highlightUpdates?: boolean;
  highlightContainer: React.MutableRefObject<HTMLSpanElement | null>;
}

export function useHighlight({ value, highlightUpdates, highlightContainer }: UseHighlight) {
  const prevValue = usePrevious(value);
  const isHighlight = useMemo(() => {
    if (!highlightUpdates || prevValue === undefined) return false;
    // highlight if value type changed
    if (typeof value !== typeof prevValue) {
      return true;
    }
    if (typeof value === 'number') {
      // notice: NaN !== NaN
      if (isNaN(value) && isNaN(prevValue as unknown as number)) return false;
      return value !== prevValue;
    }
    // highlight if isArray changed
    if (Array.isArray(value) !== Array.isArray(prevValue)) {
      return true;
    }
    // not highlight object/function
    // deep compare they will be slow
    if (typeof value === 'object' || typeof value === 'function') {
      return false;
    }

    // highlight if not equal
    if (value !== prevValue) {
      return true;
    }
  }, [highlightUpdates, value]);

  useEffect(() => {
    if (highlightContainer && highlightContainer.current && isHighlight && 'animate' in highlightContainer.current) {
      highlightContainer.current.animate(
        [{ backgroundColor: 'var(--w-rjv-update-color, #ebcb8b)' }, { backgroundColor: '' }],
        {
          duration: 1000,
          easing: 'ease-in',
        },
      );
    }
  }, [isHighlight, value, highlightContainer]);
}
