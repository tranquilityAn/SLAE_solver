import type { Matrix, Vector } from "../types";

export function solveWithGaussJordan(A: Matrix, B: Vector): Vector {
    const n = A.length;
    const augMatrix: Matrix = [];
    for (let i = 0; i < n; i++) {
        augMatrix.push([...A[i], B[i]]);
    }

    // main elimination loop
    for (let k = 0; k < n; k++) {
        let maxRow = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(augMatrix[i][k]) > Math.abs(augMatrix[maxRow][k])) {
                maxRow = i;
            }
        }

        //swap
        [augMatrix[k], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[k]];

        // check for non-degeneracy
        const pivotValue = augMatrix[k][k];
        if (Math.abs(pivotValue) < 1e-9) {
            throw new Error(
                "Matrix is degenerate (det = 0). Gauss-Jordan method cannot be applied"
            );
        }

        // normalization
        for (let j = k; j <= n; j++) {
            augMatrix[k][j] = augMatrix[k][j] / pivotValue;
        }

        // elimination
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                const factor = augMatrix[i][k];
                for (let j = k; j <= n; j++) {
                    augMatrix[i][j] =
                        augMatrix[i][j] - factor * augMatrix[k][j];
                }
            }
        }
    }

    // extract solution
    const x: Vector = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        x[i] = augMatrix[i][n];
    }

    return x;
}
