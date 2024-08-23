// Exclude keys from an object

export const exclude = (object: {}, keys: string[]): {} => {
    return Object.fromEntries(
        Object.entries(object).filter(([key]) => !keys.includes(key))
    );
}
