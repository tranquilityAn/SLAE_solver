import type { Matrix, Vector } from "../types";
import { checkDiagonalDominance } from "../utils/checkDiagonalDominance.ts";

export function solveWithJacobi(
    A: Matrix,
    B: Vector,
    epsilon: number = 1e-9,
    maxIterations: number = 1000
): Vector {
    const n = A.length;

    // validation
    if (!checkDiagonalDominance(A)) {
        console.warn(
            "Warning: Matrix is not diagonally dominant. Jacobi's method may not converge."
        );
    }

    // initialization
    let x_current: Vector = new Array(n).fill(0);
    let x_previous: Vector = new Array(n).fill(0);

    // iteration loop
    for (let k = 0; k < maxIterations; k++) {
        // vopy the current solution to the previous solution
        x_previous = x_current.slice();

        // calculate the new solution for vector x_current
        for (let i = 0; i < n; i++) {
            let sum = 0;

            // calculate the sum(a_ij * x_j) for j != i
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    sum += A[i][j] * x_previous[j];
                }
            }

            // new val for x[i]
            x_current[i] = (B[i] - sum) / A[i][i];
        }

        // check if the solution has converged
        let maxDifference = 0;
        for (let i = 0; i < n; i++) {
            const difference = Math.abs(x_current[i] - x_previous[i]);
            if (difference > maxDifference) {
                maxDifference = difference;
            }
        }

        if (maxDifference < epsilon) {
            return x_current;
        }
    }
    throw new Error(
        `Jacobi's method failed to converge within ${maxIterations} iterations.`
    );
}
