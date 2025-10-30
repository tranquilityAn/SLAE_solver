import type { Matrix, Vector } from "../types";
import { checkDiagonalDominance } from "../utils/checkDiagonalDominance";

export function solveWithSeidel(
    A: Matrix,
    B: Vector,
    epsilon: number = 1e-9,
    maxIterations: number = 1000
): Vector {
    const n = A.length;

    // validation
    if (!checkDiagonalDominance(A)) {
        console.warn(
            "Warning: Matrix is not diagonally dominant. Seidel's method may not converge."
        );
    }

    // initialization
    const x: Vector = new Array(n).fill(0);

    // iteration loop
    for (let k = 0; k < maxIterations; k++) {
        let maxDifference = 0; // for tracking changes
        for (let i = 0; i < n; i++) {
            let sum = 0;

            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    sum += A[i][j] * x[j];
                }
            }
            const old_xi = x[i];
            const new_xi = (B[i] - sum) / A[i][i];
            x[i] = new_xi;

            const difference = Math.abs(new_xi - old_xi);
            if (difference > maxDifference) {
                maxDifference = difference;
            }
        }
        if (maxDifference < epsilon) {
            return x;
        }
    }

    throw new Error(
        `Siedel's method failed to converge within ${maxIterations} iterations`
    );
}
