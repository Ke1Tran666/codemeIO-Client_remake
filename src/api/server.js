import express from "express";
import { google } from "googleapis";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import multer from "multer";
import credentials from "../../credentials/credentials.json" assert { type: "json" };

const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for video storage
const storage = multer.diskStorage({
    destination: `./uploads`,
    filename: (req, file, cb) => {
        const newFileName = `${uuidv4()}-${file.originalname}`;
        cb(null, newFileName);
    }
});

const uploadVideoFile = multer({
    storage: storage
}).single("videoFile");

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

// Store upload data
const uploads = new Map();

// Route to handle video upload
app.post("/upload", uploadVideoFile, (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        const { title, description } = req.body;
        const uploadId = uuidv4();

        uploads.set(uploadId, { filename, title, description, status: 'pending' });

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/youtube.upload"],
            state: uploadId
        });

        res.json({ authUrl, uploadId });
    } else {
        console.error("No file uploaded.");
        res.status(400).send("No file uploaded.");
    }
});

// OAuth callback route to handle token and upload video
app.get("/oauth2callback", async (req, res) => {
    const { state: uploadId, code } = req.query;
    const uploadData = uploads.get(uploadId);

    if (!uploadData) {
        return res.status(400).send("Invalid upload ID");
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

        const { data } = await youtube.videos.insert({
            resource: {
                snippet: { title: uploadData.title, description: uploadData.description },
                status: { privacyStatus: "unlisted" }
            },
            part: "snippet,status",
            media: {
                body: fs.createReadStream(`./uploads/${uploadData.filename}`)
            }
        });

        const responseData = {
            title: uploadData.title,
            description: uploadData.description,
            videoId: data.id
        };

        uploads.set(uploadId, { ...uploadData, status: 'completed', ...responseData });

        res.send("Upload successful. You can close this window and return to the application.");

        // Clean up the uploaded file
        fs.unlink(`./uploads/${uploadData.filename}`, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
    } catch (error) {
        console.error("Error in OAuth callback:", error);
        uploads.set(uploadId, { ...uploadData, status: 'error' });
        res.status(500).send("Error processing upload");
    }
});

// Route to check upload status
app.get("/upload-status/:uploadId", (req, res) => {
    const { uploadId } = req.params;
    const uploadData = uploads.get(uploadId);

    if (!uploadData) {
        return res.status(404).json({ error: "Upload not found" });
    }

    res.json(uploadData);
});

// Run server on port 3001
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});