const { main } = require('./index.js');

test("Tests index.js Error case", async() => {
    const testResult = await main();
    expect(testResult).toBe('Error');
})

test("Tests index.js Success case: ", async() => {
    const testResult = await main("data.json", "data");
    expect(testResult).toBe('Success');
})