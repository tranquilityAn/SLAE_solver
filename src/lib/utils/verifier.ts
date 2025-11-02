import type { Matrix, Vector } from "../types";

export function verifySolution(
    A: Matrix,
    B: Vector,
    X: Vector,
    epsilon: number = 1e-6
): boolean {
    const n = A.length;

    // сheck if dimensions match
    if (n !== B.length || n !== X.length) {
        console.error("Dimension mismatch during verification.");
        return false;
    }

    // reject non-numerical or infinite
    for (let i = 0; i < n; i++) {
        if (!Number.isFinite(X[i])) {
            console.warn(`Invalid solution component X[${i}] = ${X[i]}`);
            return false;
        }
    }

    // calc B
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            const a = A[i][j];
            if (!Number.isFinite(a)) {
                console.error(`Invalid matrix element A[${i}][${j}] = ${a}`);
                return false;
            }
            sum += a * X[j];
        }

        if (!Number.isFinite(sum)) {
            console.warn(`Non-finite B'[${i}] computed = ${sum}`);
            return false;
        }

        const diff = Math.abs(sum - B[i]);

        if (!Number.isFinite(diff)) {
            console.warn(
                `Non-finite residual at index ${i}: |${sum} - ${B[i]}|`
            );
            return false;
        }

        // accuracy
        if (diff > epsilon) {
            console.warn(
                `Verification failed at index ${i}: expected ${B[i]}, got ${sum} (diff=${diff})`
            );
            return false;
        }
    }

    return true;
}
