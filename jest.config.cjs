module.exports = {
    roots: ["<rootDir>/apps", "<rootDir>/test"],
    testEnvironment: "jest-environment-jsdom",
    testMatch: ["<rootDir>/test/*.test.ts"],
    transform: {
        ".*.ts$": "ts-jest",
    },
};
