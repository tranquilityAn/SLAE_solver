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

    // сalculate B_prime = A * X
    const B_prime: Vector = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += A[i][j] * X[j];
        }
        B_prime[i] = sum;
    }

    // сompare B_prime with B
    for (let i = 0; i < n; i++) {
        if (Math.abs(B_prime[i] - B[i]) > epsilon) {
            console.warn(
                `Verification failed at index ${i}: expected ${B[i]}, but got ${B_prime[i]}`
            );
            return false;
        }
    }

    return true;
}
