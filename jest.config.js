module.exports = {
    roots: ["<rootDir>/apps", "<rootDir>/test"],
    testEnvironment: "jsdom",
    testMatch: ["<rootDir>/test/*.test.ts"],
    transform: {
        ".*.ts$": "ts-jest",
    },
};
