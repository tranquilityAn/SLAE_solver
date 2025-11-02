import React from "react";
import { useGridNavigation } from "../hooks/useGridNavigation.ts";
import "../styles/matrix-grid.css";

type Props = {
    n: number;
    A: string[][];
    B: string[];
    setA: (upd: (prev: string[][]) => string[][]) => void;
    setB: (upd: (prev: string[]) => string[]) => void;
};

export default function MatrixGrid({ n, A, B, setA, setB }: Props) {
    const { setRef, handleKeyDown } = useGridNavigation(n);

    const sanitize = (v: string) => v.replace(/[^0-9.\-eE]/g, "");

    const normalizeOnBlur = (v: string) => {
        if (
            v.trim() === "" ||
            v === "-" ||
            v === "." ||
            v === "e" ||
            v === "E" ||
            v === "+"
        ) {
            return "0";
        }
        if (/[eE+\-\.]$/.test(v)) return "0";
        return v;
    };

    const onAChange = (r: number, c: number, value: string) => {
        const safe = sanitize(value);
        setA((prev) =>
            prev.map((row, i) =>
                i === r ? row.map((cell, j) => (j === c ? safe : cell)) : row
            )
        );
    };

    const onAFocus = (r: number, c: number) => {
        setA((prev) =>
            prev.map((row, i) =>
                i === r
                    ? row.map((cell, j) =>
                          j === c && cell === "0" ? "" : cell
                      )
                    : row
            )
        );
    };

    const onABlur = (r: number, c: number) => {
        setA((prev) =>
            prev.map((row, i) =>
                i === r
                    ? row.map((cell, j) =>
                          j === c ? normalizeOnBlur(cell) : cell
                      )
                    : row
            )
        );
    };

    const onBChange = (r: number, value: string) => {
        const safe = sanitize(value);
        setB((prev) => prev.map((val, i) => (i === r ? safe : val)));
    };

    const onBFocus = (r: number) => {
        setB((prev) =>
            prev.map((cell, i) => (i === r && cell === "0" ? "" : cell))
        );
    };

    const onBBlur = (r: number) => {
        setB((prev) =>
            prev.map((cell, i) => {
                if (i !== r) return cell;
                const num = parseFloat(cell);
                return Number.isNaN(num) ? "0" : num.toString();
            })
        );
    };

    if (n === 0) return <p>Set a system size (n) greater than 0 to begin.</p>;

    return (
        <div className="matrix-grid-container">
            <div
                className="matrix-grid"
                style={{ "--n": n } as React.CSSProperties}
            >
                {A.map((row, r) => (
                    <div className="matrix-row" key={`row-${r}`}>
                        <span className="matrix-brace">
                            {r === 0 ? "{" : ""}
                        </span>
                        {row.map((cell, c) => (
                            <React.Fragment key={`cell-${r}-${c}`}>
                                <input
                                    className="matrix-cell-input"
                                    type="text"
                                    value={cell}
                                    onChange={(e) =>
                                        onAChange(r, c, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                                    onFocus={() => onAFocus(r, c)}
                                    onBlur={() => onABlur(r, c)}
                                    ref={(el) => setRef(r, c, el)}
                                    aria-label={`Matrix A element ${r + 1},${
                                        c + 1
                                    }`}
                                />
                                <span className="matrix-label">
                                    x<sub>{c + 1}</sub> {c < n - 1 ? "+" : ""}
                                </span>
                            </React.Fragment>
                        ))}
                        <span className="matrix-label">=</span>
                        <input
                            type="text"
                            className="matrix-cell-input vector-cell"
                            value={B[r]}
                            onChange={(e) => onBChange(r, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, r, n)}
                            onFocus={() => onBFocus(r)}
                            onBlur={() => onBBlur(r)}
                            ref={(el) => setRef(r, n, el)}
                            aria-label={`Vector B element ${r + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
