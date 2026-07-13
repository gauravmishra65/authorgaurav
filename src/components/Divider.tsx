interface DividerProps { className?: string; }

export default function Divider({ className = '' }: DividerProps) {
  return (
    <div className={`ornament my-14 ${className}`} aria-hidden="true">
      <span>❖</span>
    </div>
  );
}
