// Exclude keys from user
module.exports = {

    exclude: (user, keys) => {
        return Object.fromEntries(
            Object.entries(user).filter(([key]) => !keys.includes(key))
        );
    }
}