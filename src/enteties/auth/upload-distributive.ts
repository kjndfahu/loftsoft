"use server";

import { Storage } from "@google-cloud/storage";
import fs from "fs/promises";
import { createReadStream } from "fs";
import os from "os";
import path from "path";

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
});

if (!process.env.GOOGLE_CLOUD_BUCKET_NAME) {
    throw new Error("GOOGLE_CLOUD_BUCKET_NAME is not defined in .env");
}

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

export async function uploadDistributive(formData: FormData): Promise<{ fileUrl: string } | { error: string }> {
    console.log("Server action called: uploadDistributive");

    try {
        // Extract the file from FormData
        const file = formData.get("file");
        if (!file || !(file instanceof File)) {
            console.error("No valid file provided in formData");
            return { error: "No file provided" };
        }

        // Validate file extension
        if (!file.name.endsWith(".exe")) {
            console.error(`Invalid file extension: ${file.name}`);
            return { error: "Only .exe files are allowed" };
        }

        console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

        // Convert the File to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Use os.tmpdir() to get the correct temp directory for the OS
        const tempDir = os.tmpdir();
        const tempPath = path.join(tempDir, file.name);
        console.log("Writing file to temp path:", tempPath);

        // Write the file to the temp directory
        await fs.writeFile(tempPath, buffer);

        // Verify the file exists before proceeding
        try {
            await fs.access(tempPath);
            console.log("Temporary file successfully written and accessible:", tempPath);
        } catch (error) {
            console.error("Failed to access temporary file:", error);
            throw new Error("Failed to write temporary file");
        }

        // Upload to GCS
        const fileName = `distributives/${Date.now()}_${file.name}`;
        console.log("Uploading to GCS as:", fileName);
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.type || "application/octet-stream",
            },
        });

        const fileStream = createReadStream(tempPath);
        console.log("Starting GCS upload stream...");
        await Promise.race([
            new Promise((resolve, reject) => {
                fileStream
                    .pipe(blobStream)
                    .on("error", (error) => {
                        console.error("Error piping file to GCS:", error);
                        reject(error);
                    })
                    .on("finish", () => {
                        console.log("GCS upload stream finished");
                        resolve(null);
                    });
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error("GCS upload timed out after 60 seconds")), 60_000);
            }),
        ]);

        console.log("Making GCS file public...");
        await blob.makePublic();
        const fileUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${fileName}`;
        console.log("File uploaded successfully:", fileUrl);

        console.log("Cleaning up temp file...");
        await fs.unlink(tempPath).catch((err) => console.error("Error deleting temp file:", err));

        return { fileUrl };
    } catch (error: any) {
        console.error("Error uploading to GCS:", error);
        return { error: `Failed to upload file: ${error.message || "Unknown error"}` };
    }
}