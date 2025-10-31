import type { MethodKey } from "../types/ui";
import { methods } from "../config/methodsMap";
import "../styles/controls.css";

type Props = {
    selected: MethodKey;
    onSelect: (m: MethodKey) => void;
    onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCalc: () => void;
    disabled?: boolean;
};

export default function Controls({
    selected,
    onSelect,
    onFile,
    onCalc,
    disabled,
}: Props) {
    return (
        <div className="controls-area">
            <div className="control-group">
                <label htmlFor="method-select">Choose Method:</label>
                <select
                    id="method-select"
                    value={selected}
                    onChange={(e) => onSelect(e.target.value as MethodKey)}
                >
                    {Object.entries(methods).map(([key, { name }]) => (
                        <option key={key} value={key}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="control-group">
                <label htmlFor="file-input">Load from file (TXT):</label>
                <input
                    id="file-input"
                    type="file"
                    accept=".txt"
                    onChange={onFile}
                />
            </div>

            <button
                className="calculate-btn"
                onClick={onCalc}
                disabled={disabled}
            >
                Calculate Solution
            </button>
        </div>
    );
}
