// Exclude keys from an object

export const exclude = (
    object: Record<string, any>,
    keys: string[]
): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(object).filter(([key]) => !keys.includes(key))
    );
};
