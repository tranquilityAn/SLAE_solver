import type { Matrix, Vector } from "../types.ts";

export function parseKeyboardInput(
    matrixText: string,
    vectorText: string
): { A: Matrix; B: Vector } {
    // --- Parse Matrix A ---
    const matrixRows = matrixText.trim().split("\n");
    const A: Matrix = matrixRows
        .filter((row) => row.trim() !== "") // Remove empty lines
        .map((row, rowIndex) => {
            return row
                .trim()
                .split(/\s+/) // Split by one or more spaces
                .map((val, colIndex) => {
                    const num = parseFloat(val);
                    if (isNaN(num)) {
                        throw new Error(
                            `Invalid character in Matrix A at row ${
                                rowIndex + 1
                            }, col ${colIndex + 1}: "${val}"`
                        );
                    }
                    return num;
                });
        });

    // --- Parse Vector B ---
    const vectorRows = vectorText.trim().split("\n");
    const B: Vector = vectorRows
        .filter((val) => val.trim() !== "") // Remove empty lines
        .map((val, index) => {
            const num = parseFloat(val);
            if (isNaN(num)) {
                throw new Error(
                    `Invalid character in Vector B at row ${
                        index + 1
                    }: "${val}"`
                );
            }
            return num;
        });

    // --- Validate Dimensions ---
    if (A.length === 0 || B.length === 0) {
        throw new Error("Matrix A and Vector B cannot be empty.");
    }
    if (A.length !== B.length) {
        throw new Error(
            `Dimension mismatch: Matrix A has ${A.length} rows, but Vector B has ${B.length} elements.`
        );
    }
    const n = A.length;
    for (let i = 0; i < n; i++) {
        if (A[i].length !== n) {
            throw new Error(
                `Matrix A is not square. Row ${i + 1} has ${
                    A[i].length
                } elements, but ${n} were expected.`
            );
        }
    }

    return { A, B };
}

export function parseFileInput(fileContent: string): { A: Matrix; B: Vector } {
    const lines = fileContent.trim().split("\n");

    if (lines.length === 0) {
        throw new Error("File is empty.");
    }

    // Parse n (size)
    const n = parseInt(lines[0].trim(), 10);
    if (isNaN(n) || n <= 0) {
        throw new Error(`Invalid dimension 'n' on line 1: "${lines[0]}"`);
    }

    if (lines.length < n + 1) {
        throw new Error(
            `File format error: Expected ${n + 1} lines, but found ${
                lines.length
            }.`
        );
    }

    const A: Matrix = [];
    const B: Vector = [];

    // Parse A and B
    for (let i = 1; i <= n; i++) {
        const rowValues = lines[i].trim().split(/\s+/);

        if (rowValues.length !== n + 1) {
            throw new Error(
                `File format error on line ${i + 1}: Expected ${
                    n + 1
                } numbers, but found ${rowValues.length}.`
            );
        }

        const aRow: number[] = [];
        for (let j = 0; j < n; j++) {
            const num = parseFloat(rowValues[j]);
            if (isNaN(num)) {
                throw new Error(
                    `Invalid number in matrix A on line ${i + 1}: "${
                        rowValues[j]
                    }"`
                );
            }
            aRow.push(num);
        }
        A.push(aRow);

        const bVal = parseFloat(rowValues[n]);
        if (isNaN(bVal)) {
            throw new Error(
                `Invalid number in vector B on line ${i + 1}: "${rowValues[n]}"`
            );
        }
        B.push(bVal);
    }

    return { A, B };
}
