import type { Matrix, Vector } from "../types";

export function solveWithGauss(A: Matrix, B: Vector): Vector {
    console.log("Gauss method was called with matrix:", A, "and vector:", B);

    const n = A.length;
    const a: Matrix = A.map((row) => [...row]);
    const b: Vector = [...B];

    // --- FORWARD ELIMINATION ---
    for (let k = 0; k < n; k++) {
        //find row with the largest value in current column(k)
        let maxRow = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(a[i][k]) > Math.abs(a[maxRow][k])) {
                maxRow = i;
            }
        }

        // swap current row(k) with maxRow
        [a[k], a[maxRow]] = [a[maxRow], a[k]];
        [b[k], b[maxRow]] = [b[maxRow], b[k]];

        // check for non-degeneracy
        if (Math.abs(a[k][k]) < 1e-9) {
            throw new Error(
                "Matrix is degenerate (det = 0). Gauss's method cannot be applied"
            );
        }

        // elimination
        for (let i = k + 1; i < n; i++) {
            const factor = a[i][k] / a[k][k];
            for (let j = k; j < n; j++) {
                a[i][j] = a[i][j] - factor * a[k][j];
            }
            b[i] = b[i] - factor * b[k];
        }
    }

    // --- BACK SUBSTITUTION ---
    const x: Vector = new Array(n).fill(0);

    // start from the last equation
    for (let i = n - 1; i >= 0; i--) {
        let sum = b[i];
        for (let j = i + 1; j < n; j++) {
            sum = sum - a[i][j] * x[j];
        }
        x[i] = sum / a[i][i];
    }
    return x;
}
