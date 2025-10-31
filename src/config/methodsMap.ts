import type { Matrix, Vector } from "../lib/types";
import { solveWithCramer } from "../lib/methods/cramer";
import { solveWithGauss } from "../lib/methods/gauss";
import { solveWithGaussJordan } from "../lib/methods/gaussJordan";
import { solveWithSeidel } from "../lib/methods/seidel";
import { solveWithJacobi } from "../lib/methods/jacobi";
import type { MethodKey } from "../types/ui";

export const methods: Record<
    MethodKey,
    { name: string; solve: (A: Matrix, B: Vector) => Vector }
> = {
    gauss: { name: "Gauss's Method", solve: solveWithGauss },
    gaussJordan: { name: "Gauss-Jordan Method", solve: solveWithGaussJordan },
    cramer: { name: "Cramer's Method", solve: solveWithCramer },
    seidel: { name: "Seidel's Method", solve: solveWithSeidel },
    jacobi: { name: "Jacobi's Method", solve: solveWithJacobi },
};
