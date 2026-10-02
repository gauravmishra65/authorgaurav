import { useEffect, useState } from 'react';
import { trackLoad } from './appReady';

interface SupabaseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseData<T>(fetcher: () => Promise<T>, deps: unknown[] = []): SupabaseDataState<T> {
  const [state, setState] = useState<SupabaseDataState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const finished = trackLoad();

    fetcher()
      .then((result) => {
        if (!cancelled) setState({ data: result, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Something went wrong.' });
      })
      .finally(finished);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
