module.exports = {
    PORT : process.env.PORT || 8080,
    NB_SALT_ROUNDS : process.env.NB_SALT_ROUNDS || 8,
    SALT : process.env.SALT || "i_love_salt"
}
