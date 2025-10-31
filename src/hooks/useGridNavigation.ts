import { useRef } from "react";

/** Holds refs for A (n columns) + B (1 column) and provides arrow navigation. */
export function useGridNavigation(n: number) {
    const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>(
        new Array(n)
    );

    const ensureRow = (r: number) => {
        if (!inputRefs.current[r]) inputRefs.current[r] = new Array(n + 1);
        return inputRefs.current[r];
    };

    const setRef = (r: number, c: number, el: HTMLInputElement | null) => {
        ensureRow(r)[c] = el;
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        r: number,
        c: number
    ) => {
        let nextR = r,
            nextC = c;
        const cols = n + 1;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            nextR = r > 0 ? r - 1 : n - 1;
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            nextR = r < n - 1 ? r + 1 : 0;
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            nextC = c > 0 ? c - 1 : cols - 1;
            nextR = c > 0 ? r : r > 0 ? r - 1 : n - 1;
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            nextC = c < cols - 1 ? c + 1 : 0;
            nextR = c < cols - 1 ? r : r < n - 1 ? r + 1 : 0;
        }

        const target = inputRefs.current[nextR]?.[nextC];
        target?.focus();
    };

    return { setRef, handleKeyDown, inputRefs };
}
