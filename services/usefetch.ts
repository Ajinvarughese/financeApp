// services/usefetch.ts
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Generic useFetch hook
 *
 * @template T - type of resolved data
 * @param fn - async function that returns Promise<T> or accepts an optional signal param: fn(signal?: { aborted?: boolean })
 * @param deps - dependency array to re-run the request (optional)
 * @param options - { immediate?: boolean } if false you must call refetch() to load
 *
 * Returns: { data, loading, error, refetch, reset, cancel }
 *
 * Example:
 * const { data, loading, error, refetch, reset } = useFetch(() => fetchAssets({}), [query], { immediate: true });
 */
export default function useFetch<T = any>(
    fn: (signal?: { aborted?: boolean }) => Promise<T>,
    deps: any[] = [],
    options: { immediate?: boolean } = { immediate: true }
) {
    const isMounted = useRef(true);
    const abortId = useRef(0);

    const activeController = useRef<{ aborted?: boolean } | null>(null);

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(!!options.immediate);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(
        async (controller: { aborted?: boolean } = { aborted: false }) => {
            // assign active controller (so we can cancel manually)
            activeController.current = controller;

            setLoading(true);
            setError(null);

            const id = ++abortId.current;

            try {
                // allow fn to accept the controller (signal) if it wants
                const result = await fn(controller);
                // ignore if stale
                if (abortId.current !== id) return;
                if (!isMounted.current || controller.aborted) return;
                setData(result as T);
            } catch (err) {
                if (abortId.current !== id) return;
                if (!isMounted.current || controller.aborted) return;
                setError(err);
            } finally {
                if (abortId.current !== id) return;
                if (!isMounted.current || controller.aborted) return;
                setLoading(false);
                // clear active controller if it's still the same one
                if (activeController.current === controller) activeController.current = null;
            }
        },
        // NOTE: fn is expected to be stable (wrap with useCallback when passing inline functions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps
    );

    // initial effect (runs immediately if desired)
    useEffect(() => {
        isMounted.current = true;
        const controller = { aborted: false };
        // store as active controller for potential cancellation
        activeController.current = controller;

        if (options.immediate) {
            execute(controller);
        }

        return () => {
            isMounted.current = false;
            // mark controller aborted on unmount
            controller.aborted = true;
            activeController.current = null;
        };
        // execute is memoized with deps; include options.immediate in deps intentionally
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, options.immediate]);

    /**
     * refetch: triggers the fetch and returns a cancel function
     * Usage: const cancel = refetch(); ... cancel();
     */
    const refetch = useCallback(() => {
        const controller = { aborted: false };
        execute(controller);
        // return a cancel function
        return () => {
            controller.aborted = true;
            // also wipe activeController if it's this one
            if (activeController.current === controller) activeController.current = null;
        };
    }, [execute]);

    /**
     * reset: clear data & error, stop loading
     */
    const reset = useCallback(() => {
        // increment abortId so any in-flight results are ignored
        abortId.current++;
        setData(null);
        setError(null);
        setLoading(false);
        // cancel any active controller
        if (activeController.current) activeController.current.aborted = true;
        activeController.current = null;
    }, []);

    /**
     * cancel: cancel current active request (if any)
     */
    const cancel = useCallback(() => {
        if (activeController.current) {
            activeController.current.aborted = true;
            activeController.current = null;
        }
        // also increment abortId to ignore any in-flight responses
        abortId.current++;
        setLoading(false);
    }, []);

    return { data, loading, error, refetch, reset, cancel };
}
