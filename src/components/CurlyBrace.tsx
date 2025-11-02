type Props = { stroke?: string; strokeWidth?: number; className?: string };

export default function CurlyBrace({
    stroke = "#777",
    strokeWidth = 2,
    className,
}: Props) {
    return (
        <svg
            className={className}
            viewBox="0 0 20 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="
          M 18 0
          C 6 0, 6 10, 6 18
          L 6 34
          C 6 40, 4 44, 2 50
          C 4 56, 6 60, 6 66
          L 6 82
          C 6 90, 6 100, 18 100
        "
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
