import fs from "node:fs/promises";

const FilePath = "data.txt";

async function createFile(content) {
    try {
        await fs.writeFile(FilePath, content, "utf8");
        console.log("File created successfully");
    } catch (error) {
        console.log("Error creating file:", error);
    }
}
async function appendFile(content) {
    try {
        await fs.appendFile(FilePath, content, "utf8");
        console.log("Content appended successfully");
    } catch (error) {
        console.log("Error appending file:", error);
    }
}

async function readFile() {
    try {
        const content = await fs.readFile(FilePath, "utf8");
        console.log("File read successfully");
        console.log("File content:", content);
    } catch (error) {
        console.log("Error reading file:", error);
    }
}

async function main() {
    await createFile("Hello World");
    await appendFile("This is appended content.\n");
    await readFile();
}

main();