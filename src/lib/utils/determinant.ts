import type { Matrix } from '../types';

export function determinant(M: Matrix) : number {
    const n = M.length;

    // Base case 1x1
    if (n === 1) {
        return M[0][0];
    }

    // Base case 2x2
    if (n === 2) {
        return M[0][0] * M[1][1] - M[0][1] * M[1][0];
    }

    // Recursion case NxN (N > 2)
    let det = 0;
    for (let j = 0; j < n; j++) {
        const subMatrix: Matrix = [];
        for (let i = 1; i < n; i++){ //skip the first row
            const newRow: number[] = [];
            for (let k = 0; k < n; k++) {
                if (k != j) { // skip the j-th column
                    newRow.push(M[i][k]);
                }
            }
            subMatrix.push(newRow);
        }
        const sign = (j % 2 === 0) ? 1 : -1;

        det += sign * M[0][j] * determinant(subMatrix);
    }
    return det;
}