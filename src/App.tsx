import React, { useEffect, useState } from "react";
import "./styles/global.css";
import type { Matrix, Vector } from "./lib/types";
import { verifySolution } from "./lib/utils/verifier";
import { parseFileInput } from "./lib/utils/parser";

import Header from "./components/Header";
import SizeControl from "./components/SizeControl";
import MatrixGrid from "./components/MatrixGrid";
import Controls from "./components/Controls";
import Output from "./components/Output";

import { methods } from "./config/methodsMap";
import type { MethodKey } from "./types/ui";

// helpers to init/resize string-based state
const createZeroStringMatrix = (size: number) =>
    Array.from({ length: size }, () => Array(size).fill("0"));
const createZeroStringVector = (size: number) => Array(size).fill("0");

const resizeStringMatrix = (prev: string[][], size: number): string[][] => {
    const next = createZeroStringMatrix(size);
    const min = Math.min(prev.length, size);
    for (let i = 0; i < min; i++) {
        for (let j = 0; j < min; j++) {
            if (prev[i]?.[j] !== undefined) next[i][j] = prev[i][j];
        }
    }
    return next;
};

const resizeStringVector = (prev: string[], size: number): string[] => {
    const next = createZeroStringVector(size);
    const min = Math.min(prev.length, size);
    for (let i = 0; i < min; i++) if (prev[i] !== undefined) next[i] = prev[i];
    return next;
};

export default function App() {
    const [n, setN] = useState(3);
    const [A, setA] = useState<string[][]>(() => createZeroStringMatrix(3));
    const [B, setB] = useState<string[]>(() => createZeroStringVector(3));
    const [method, setMethod] = useState<MethodKey>("gauss");
    const [output, setOutput] = useState("Results will be shown here.");

    // keep A,B sized with n
    useEffect(() => {
        setA((prev) => resizeStringMatrix(prev, n));
        setB((prev) => resizeStringVector(prev, n));
    }, [n]);

    const handleFileRead = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (!content) {
                setOutput("Error: File is empty or unreadable.");
                return;
            }

            try {
                const { A: aNum, B: bNum } = parseFileInput(content);
                setN(aNum.length);
                setA(aNum.map((row) => row.map((x) => x.toString())));
                setB(bNum.map((x) => x.toString()));
                setOutput(
                    `Successfully loaded data from "${file.name}".\nSystem size set to n=${aNum.length}.\nPress "Calculate Solution" to solve.`
                );
            } catch (err: any) {
                setOutput(`File Read Error: ${err.message}`);
            }
        };
        reader.onerror = () =>
            setOutput(`Error reading file: ${reader.error?.message}`);
        reader.readAsText(file);
        event.target.value = "";
    };

    const handleCalculate = () => {
        if (n === 0) {
            setOutput("Error: Cannot solve an empty system (n=0).");
            return;
        }

        let Am: Matrix, Bb: Vector;
        try {
            Am = A.map((row, r) =>
                row.map((cell, c) => {
                    const num = parseFloat(cell);
                    if (Number.isNaN(num)) {
                        if (cell.trim() === "")
                            throw new Error(
                                `Empty value at A[${r + 1}][${c + 1}]`
                            );
                        throw new Error(
                            `Invalid number at A[${r + 1}][${c + 1}]: "${cell}"`
                        );
                    }
                    return num;
                })
            );
            Bb = B.map((cell, r) => {
                const num = parseFloat(cell);
                if (Number.isNaN(num)) {
                    if (cell.trim() === "")
                        throw new Error(`Empty value at B[${r + 1}]`);
                    throw new Error(`Invalid number at B[${r + 1}]: "${cell}"`);
                }
                return num;
            });
        } catch (err: any) {
            setOutput(`Input Error: ${err.message}`);
            return;
        }

        try {
            const solve = methods[method].solve;
            const t0 = performance.now();
            const X = solve(
                Am.map((r) => [...r]),
                [...Bb]
            ); // protect from mutation
            const t1 = performance.now();
            if (!Array.isArray(X) || X.some((v) => !Number.isFinite(v))) {
                setOutput(
                    [
                        `--- ${methods[method].name} ---`,
                        "The method cannot be applied to this system because:",
                        "- the matrix is not diagonally dominant, or",
                        "- it has zero/small diagonal elements, or",
                        "- the iterations diverge.",
                        "",
                        "Try another method.",
                    ].join("\n")
                );
                return;
            }
            const ok = verifySolution(Am, Bb, X);
            const sol = X.map((x, i) => `x${i + 1} = ${x.toPrecision(5)}`).join(
                "\n"
            );
            setOutput(
                `--- ${
                    methods[method].name
                } ---\nSolution (X):\n${sol}`
            );
        } catch (err: any) {
            setOutput(
                [
                    `--- ${methods[method].name} ---`,
                    "The method cannot be applied:",
                    err?.message ?? "Unknown calculation error.",
                ].join("\n")
            );
        }
    };

    return (
        <div className="app-container">
            <Header />
            <main>
                <div className="input-area">
                    <SizeControl n={n} onChange={setN} />
                    <MatrixGrid n={n} A={A} B={B} setA={setA} setB={setB} />
                </div>

                <Controls
                    selected={method}
                    onSelect={setMethod}
                    onFile={handleFileRead}
                    onCalc={handleCalculate}
                    disabled={n === 0}
                />

                <Output text={output} />
            </main>
        </div>
    );
}
