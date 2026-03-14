export function StepList({ steps }: { steps: string[] }) {
    return (
        <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed text-ollin-black/70 max-md:text-[13.5px]">
            {steps.map((t, i) => (
                <p
                    key={i}
                    className="max-md:break-words max-md:hyphens-auto max-md:[overflow-wrap:anywhere]"
                >
                    <span className="font-medium text-ollin-black/80">{i + 1}.</span> {t}
                </p>
            ))}
        </div>
    );
}
