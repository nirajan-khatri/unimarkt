// hooks/useGenericUrlState.ts
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useMemo } from "react";

type ParserType = 'string' | 'integer';

interface UrlStateConfig<T> {
  key: string;
  defaultValue: T;
  parser?: ParserType;
  clearOnDefault?: boolean;
}

// Generic hook for managing URL state
export function useUrlState<T extends string | number>(
  config: UrlStateConfig<T>
) {
  const parser = useMemo(() => {
    const baseParser = config.parser === 'integer' 
      ? parseAsInteger 
      : parseAsString;
    
    return (baseParser as any)
      .withDefault(config.defaultValue)
      .withOptions({
        clearOnDefault: config.clearOnDefault ?? true,
      });
  }, [config.defaultValue, config.parser, config.clearOnDefault]);

  const [value, setValue] = useQueryState(config.key, parser);

  return {
    value: value as T,
    setValue: setValue as (value: T) => void,
    clear: () => setValue(config.defaultValue),
    hasValue: value !== config.defaultValue,
  };
}

// Hook for managing multiple URL states
export function useMultipleUrlStates<T extends Record<string, any>>(
  configs: { [K in keyof T]: UrlStateConfig<T[K]> }
) {
  const states = {} as { [K in keyof T]: ReturnType<typeof useUrlState<T[K]>> };
  
  for (const key in configs) {
    states[key] = useUrlState(configs[key]);
  }

  const values = useMemo(() => {
    const result = {} as T;
    for (const key in states) {
      result[key] = states[key].value;
    }
    return result;
  }, [states]);

  const setValues = (newValues: Partial<T>) => {
    for (const key in newValues) {
      if (states[key] && newValues[key] !== undefined) {
        states[key].setValue(newValues[key]);
      }
    }
  };

  const clearAll = () => {
    for (const key in states) {
      states[key].clear();
    }
  };

  const hasAnyValue = Object.values(states).some((state: any) => state.hasValue);

  return {
    values,
    states,
    setValues,
    clearAll,
    hasAnyValue,
  };
}

// Example usage for filters
export function useFilterUrlStates() {
  return useMultipleUrlStates({
    minPrice: { key: 'minPrice', defaultValue: '' },
    maxPrice: { key: 'maxPrice', defaultValue: '' },
    module: { key: 'module', defaultValue: '' },
    search: { key: 'search', defaultValue: '' },
    page: { key: 'page', defaultValue: 1, parser: 'integer' },
  });
}