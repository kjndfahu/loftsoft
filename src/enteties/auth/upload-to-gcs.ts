"use server";

import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

// Service account credentials
const serviceAccount = {
    type: "service_account",
    project_id: "project-distributives",
    private_key_id: "57a6d597121941c6e06401e905d8cd0a86d63bad",
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCORuI8X4lWl50W\nYEZofrMGKwa/kkyBHZYiHrgZ8xhLvX97onWrAQ2YBbVPOvs8XsSDma7IyWXklr1J\nLzXhuuMEPbd5Ybf6gz1zNDOjbSW0am3P3ECOurJziQwnPblmHSlVPW44XJTw72EI\nkicXPRJ+hXVZNfawbqqjwYQjI0Vl0Ck7l22wtU22dsZd9DIfg0taD8xRwMBrlOP0\nTTvT/bfs9EcYi08MQbVKQ1bkPMwi9ws4NSe8+PHxOyzgh/NMzqS062TN6COr/Jfc\nkEBdzJNtXdu9t27/kgdpaBdtc/X8VqKb0OwaT49I+DvXDwg+9q5oEgml0J2sQtB8\nBBxfcplfAgMBAAECggEAHdYYmH+SbgHSdABRk5VKVrdMLX1xJLx/IP2fLvXvOObu\n5o79rRRF9QTxbkGYsSLQhCaE5F9zyjmgTUokuwc1l0yX/tDyw4qlJtUiJRn9B7Yv\n/CCcuzHEvXzWex4zFIp2AgWlaRVlOJeCmkkIAJQSnky/fKtX5cz3ZOrumm3Jnl12\nOn8sWoBa8W7aXSWSkrlLJca6XkeTR6Yo2oTj9nuHzS9TedAiPcNzm5SlNWT28Fq2\nI/8idzbpabLAk67Spm6TCQmvDRFbRbSDX1o2BXNWufvTDyTO6UiXMiy4z1jVKg+j\nja05pFhpKEDYwt7sSiJxx0p4ujAm/dNZlpzUcKul+QKBgQDIul4GFIQXc3hykA95\nTEQ7ORLA5QK9OA3EYJ4dDe3Vi4PJEQDUgo73iVP770pNzBjpLEIlibjImZUzQiSy\nJcLu7O5IT6CaPQAHNdld3LWY3fQ2ktyNkDqMeCJuPATyoYaoUy0IYgXQVBGBAyWL\nxLjtb1fE0dtC0fhoQWI9rhNZmQKBgQC1dDSvgc2fscM8rcqAGblaAI+qDVOYbV2h\ntgSzxfgS3zmfnuIW9b2OfLC3d45zeU5jfRzFYGecb71A8VEiMJG7W59EUokif+nH\nPXhphz1BAGAGB0CCJ/tQdWw82RLpaMlMOjCVIZ0G8me7EN2Ne52B59GnmplOaQg+\n5X1oFeQVtwKBgAUEU3FHdf24Dxyd6SUY+OOaC5PypVzhV8a+u3Tyci1SLVsLJ8An\n+zbIoea8FllXbo/1YTna9VleLVJ4pr4lH3glR9da1iLEv4lumR41c/x8H6x1gzmu\njygPoJyst1rxGpJ+cbOx739DeqSE1Z1mr1CP5duvexFyegjxCWmNPkKRAoGAeY4q\nSTR8ijFsZ/bIhD43U9qyYyngSWliYxVrWv8Q65uMn6ixLs5auNxBCfbWf/bQk4dZ\nwcOORVb5gkrmni/JQKjlLcDYyzrDYkyEoLUPTL8ylHdBOLAOBF1VMAH/UEt5Jk6J\nAy5sYh37bW6j7MbVwhOI+G1xq/xioLfd5d9cV0sCgYBAZpUwv5+zwZ8CBL2avxV5\nAsxJUCXZelBgmBluWSzLom2XKVZUmYg8Jc8bou3XEkMhUBviBS1Utg9tsd81VRMF\n+i/qeYJ3yi18lbPllFyodRLfywYFYfEzzkwdyh2lpzo4tEihwfssDlK850ICcwi4\noQ+zke95r0RhzYVOCV7fSA==\n-----END PRIVATE KEY-----\n`,
    client_email: "service-account@project-distributives.iam.gserviceaccount.com",
    client_id: "101760069904161162308",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40project-distributives.iam.gserviceaccount.comkeep-alive",
    universe_domain: "googleapis.com",
};

// Initialize Google Cloud Storage
const storage = new Storage({
    credentials: serviceAccount,
    projectId: serviceAccount.project_id,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "loftsoft"; // Use the bucket name from your environment variable

const bucket = storage.bucket(bucketName);

interface FileData {
    name: string;
    type: string;
    content: number[]; // Array of bytes
}

export async function uploadFileToGCS(fileData: FileData): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
    try {
        // Generate a unique file name
        const fileName = `${uuidv4()}-${fileData.name}`;
        const fileUpload = bucket.file(fileName);

        // Convert the content (array of bytes) back to a Buffer
        const buffer = Buffer.from(fileData.content);

        // Create a stream to upload the file
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: fileData.type,
            },
        });

        // Upload the file
        await new Promise((resolve, reject) => {
            stream.on("error", (err) => {
                reject(err);
            });
            stream.on("finish", () => {
                resolve(true);
            });
            stream.end(buffer);
        });

        // Get the public URL (no need for makePublic() since IAM handles access)
        const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

        return { success: true, fileUrl };
    } catch (error) {
        console.error("Error uploading file to GCS:", error);
        return { success: false, error: "Failed to upload file to GCS" };
    }
}