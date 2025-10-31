import "../styles/size-control.css";

type Props = { n: number; onChange: (next: number) => void };

export default function SizeControl({ n, onChange }: Props) {
    return (
        <div className="size-control">
            <label htmlFor="size-input">System Size (n):</label>
            <input
                id="size-input"
                type="number"
                value={n}
                min={0}
                max={12}
                onChange={(e) => {
                    let v = parseInt(e.target.value, 10);
                    if (Number.isNaN(v)) v = 0;
                    v = Math.max(0, Math.min(12, v));
                    onChange(v);
                }}
            />
        </div>
    );
}
