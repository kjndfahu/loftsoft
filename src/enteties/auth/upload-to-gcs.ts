// upload-to-gcs.ts
"use server";

import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

// Service account credentials (redacted for security; ensure they are correct)
const serviceAccount = {
    type: "service_account",
    project_id: "project-distributives",
    private_key_id: "57a6d597121941c6e06401e905d8cd0a86d63bad",
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY, // Store in .env
    client_email: "service-account@project-distributives.iam.gserviceaccount.com",
    client_id: "101760069904161162308",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40project-distributives.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
};

// Initialize Google Cloud Storage
const storage = new Storage({
    credentials: serviceAccount,
    projectId: serviceAccount.project_id,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "loftsoft";

const bucket = storage.bucket(bucketName);

interface FileData {
    name: string;
    type: string;
    content: number[]; // Array of bytes
}

export async function uploadFileToGCS(fileData: FileData): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
    try {
        // Validate inputs
        if (!fileData.name || !fileData.type || !fileData.content || fileData.content.length === 0) {
            console.error("Invalid file data:", { name: fileData.name, type: fileData.type, contentLength: fileData.content?.length });
            return { success: false, error: "Invalid file data: missing name, type, or content" };
        }

        // Validate bucket name
        if (!bucketName) {
            console.error("Missing GOOGLE_CLOUD_BUCKET_NAME environment variable");
            return { success: false, error: "Missing bucket name configuration" };
        }

        // Generate a unique file name
        const fileName = `${uuidv4()}-${fileData.name}`;
        const fileUpload = bucket.file(fileName);

        // Convert content to Buffer
        const buffer = Buffer.from(fileData.content);

        // Upload file with metadata
        await new Promise((resolve, reject) => {
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: fileData.type,
                    cacheControl: "public, max-age=31536000",
                },
            });

            stream.on("error", (err) => {
                console.error(`GCS upload error for ${fileName}:`, err);
                reject(err);
            });
            stream.on("finish", () => {
                console.log(`File uploaded to GCS: ${fileName}`);
                resolve(true);
            });
            stream.end(buffer);
        });

        // Generate public URL
        const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

        // Verify file accessibility
        try {
            await fileUpload.getMetadata();
            console.log(`File verified in GCS: ${fileUrl}`);
        } catch (error) {
            console.error(`Failed to verify file in GCS: ${fileUrl}`, error);
            return { success: false, error: "File uploaded but not accessible in GCS" };
        }

        return { success: true, fileUrl };
    } catch (error: any) {
        console.error("Error uploading file to GCS:", error.message, error.stack);
        return { success: false, error: `Failed to upload file to GCS: ${error.message}` };
    }
}