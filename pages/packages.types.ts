export type PackageTier = {
    id: string;
    name: string;
    oneLiner: string;
    bullets: string[];
    bestFor: string;
    timeline: string;
    includes: { title: string; items: string[] }[];
};

export type SingleService = {
    id: string;
    name: string;
    hint: string;
};

export type CompareRow = {
    key: string;
    label: string;
    hint?: string;
    values: Record<string, boolean>; // packageId -> included?
};
