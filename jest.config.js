module.exports = {
    roots: [
        '<rootDir>/apps',
        '<rootDir>/test',
    ],
    testMatch: [
        '<rootDir>/test/*.test.ts',
    ],
    transform: {
        '.*.ts$': 'ts-jest',
    },
};
