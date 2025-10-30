import type { Matrix } from "../types";

export function checkDiagonalDominance(A: Matrix): boolean {
    const n = A.length;
    for (let i = 0; i < n; i++) {
        let diagonalValue = 0;
        let nonDiagonalSum = 0;

        for (let j = 0; j < n; j++) {
            if (i === j) {
                diagonalValue = Math.abs(A[i][j]);
            } else {
                nonDiagonalSum += Math.abs(A[i][j]);
            }
        }

        // check |aii| > sum(|aij|) fro j != 1
        if (diagonalValue <= nonDiagonalSum) {
            return false;
        }

        // check for 0 in diagonal
        if (Math.abs(diagonalValue) < 1e-9) {
            return false;
        }
    }
    return true;
}