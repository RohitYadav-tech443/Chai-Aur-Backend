import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from 'fs/promises';

const askAI = asyncHandler(async (req, res) => {
    const { question, videoId, threadId } = req.body;

    if (!question || !question.trim()) {
        throw new ApiError(400, "Question is required");
    }

    try {
        const response = await axios.post(
            process.env.AI_SERVICE_URL,
            {
                question: question.trim(),
                videoId: videoId || null,
                threadId: threadId || null,
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                response.data,
                "AI response generated successfully"
            )
        );

    } catch (error) {
        console.error("========== AI SERVICE ERROR ==========");
        console.error(error.response?.data || error.message);
        console.error("======================================");

        throw new ApiError(
            500,
            "AI service is currently unavailable"
        );
    }
});


const uploadPDF = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "PDF file is required");
    }

    const { threadId } = req.body;

    if (!threadId) {
        throw new ApiError(400, "Thread ID is required");
    }

    try {
        console.log("========== PDF UPLOAD ==========");
        console.log("File:", req.file.originalname);
        console.log("Path:", req.file.path);
        console.log("Size:", req.file.size);
        console.log("Thread ID:", threadId);

        // Read the PDF that Multer saved on disk
        const fileBuffer = await fs.readFile(req.file.path);

        // Create multipart form-data for FastAPI
        const formData = new FormData();

        const pdfBlob = new Blob(
            [fileBuffer],
            {
                type: req.file.mimetype || "application/pdf",
            }
        );

        formData.append(
            "file",
            pdfBlob,
            req.file.originalname
        );

        formData.append("threadId", threadId);

        // Send PDF to Python/FastAPI chatbot
        const response = await axios.post(
            "https://langgraph-chatbot-3-ybs6.onrender.com/upload-pdf",
            formData
        );

        console.log("FastAPI PDF response:", response.data);

        // Delete temporary PDF from MERN server
        try {
            await fs.unlink(req.file.path);
        } catch (cleanupError) {
            console.log(
                "Temporary PDF cleanup failed:",
                cleanupError.message
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                response.data,
                "PDF uploaded and indexed successfully"
            )
        );

    } catch (error) {

        console.error("========== PDF UPLOAD ERROR ==========");
        console.error("Message:", error.message);
        console.error(
            "FastAPI response:",
            error.response?.data
        );
        console.error("======================================");

        // Try removing temporary file even if FastAPI fails
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch {
                // Ignore cleanup error
            }
        }

        throw new ApiError(
            500,
            "Failed to upload and process PDF"
        );
    }
});


export {
    askAI,
    uploadPDF,
};