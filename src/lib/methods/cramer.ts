import type { Matrix, Vector } from "../types";
import { determinant } from "../utils/determinant.ts";

export function solveWithCramer(A: Matrix, B: Vector): Vector {
    const n = A.length;

    // check for dimension
    if (n > 4) {
        throw new Error(
            `Cramer's method not reccommended for n > 4. Current dimension: ${n}`
        );
    }

    const mainDeterminant = determinant(A);

    // check for non-degeneracy
    if (Math.abs(mainDeterminant) < 1e-9) {
        throw new Error(
            "'Matrix is non-degeneracy (det = 0). Cramer's method cannot be applied"
        );
    }

    const roots: Vector = []; //results

    // determinant for each xi
    for (let j = 0; j < n; j++) {
        const tempMatrix = A.map((row) => [...row]);

        // replace j-th column on vector B
        for (let i = 0; i < n; i++) {
            tempMatrix[i][j] = B[i];
        }

        // det
        const det_i = determinant(tempMatrix);

        roots.push(det_i / mainDeterminant);
    }
    return roots;
}
