import fs from "node:fs/promises";

const FilePath = "data.json";

async function createFile(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(FilePath, jsonData, "utf8");
        console.log("JSON file created successfully");
    } catch (error) {
        console.log("Error creating file:", error);
    }
}

async function readFile() {
    try {
        const content = await fs.readFile(FilePath, "utf8");
        const data = JSON.parse(content);

        console.log("File read successfully");
        console.log("File content:", data);
    } catch (error) {
        console.log("Error reading file:", error);
    }
}

async function main() {
    await createFile({
        name: "Akshay",
        branch: "CSE",
        college: "ABES"
    });

    await readFile();
}

main();