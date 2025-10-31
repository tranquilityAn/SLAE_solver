import "../styles/output.css";

type Props = { text: string };
export default function Output({ text }: Props) {
    return (
        <div className="output-area">
            <label>Results:</label>
            <pre>{text}</pre>
        </div>
    );
}
