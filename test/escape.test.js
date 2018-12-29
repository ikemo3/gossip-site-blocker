describe("escape", () => {
    it("space", () => {
        expect($.escape(" ")).toBe("+");
    });
    it("+", () => {
        expect($.escape("+")).toBe("\\+");
    });
    it("\\", () => {
        expect($.escape("\\")).toBe("\\\\");
    });
    it(" +\\", () => {
        expect($.escape(" +\\")).toBe("+\\+\\\\");
    });
});
describe("unescape", () => {
    it("+", () => {
        expect($.unescape("+")).toBe(" ");
    });
    it("\\+", () => {
        expect($.unescape("\\+")).toBe("+");
    });
    it("\\\\", () => {
        expect($.unescape("\\\\")).toBe("\\");
    });
    it("\\\\\+", () => {
        expect($.unescape("\\\\\+")).toBe("\\ ");
    });
    it("+\\++\\++", () => {
        expect($.unescape("+\\++\\++")).toBe(" + + ");
    });
});
//# sourceMappingURL=escape.test.js.map