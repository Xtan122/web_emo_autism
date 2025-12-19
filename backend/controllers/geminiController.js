import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeEmotion = async (req, res) => {
  try {
    const { imageBase64, targetEmotion } = req.body;

    if (!imageBase64 || !targetEmotion) {
      return res.status(400).json({ message: "Thiếu dữ liệu ảnh hoặc cảm xúc mục tiêu" });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Bạn là một người bạn đồng hành để dạy trẻ tự kỷ nhận biết cảm xúc.
      Hãy nhìn bức ảnh này. Trẻ tự kỷ trong ảnh đang cố gắng thể hiện cảm xúc: "${targetEmotion}".
      
      Hãy phân tích biểu cảm khuôn mặt (mắt, miệng, lông mày) của trẻ và so sánh với cảm xúc mục tiêu.
      
      Trả về kết quả dưới dạng JSON (không dùng Markdown) với cấu trúc sau:
      {
        "isMatch": boolean, (true nếu giống cảm xúc mục tiêu, false nếu không)
        "emoji": string, (một emoji phù hợp với biểu cảm trong ảnh)
        "message": string, (lời nhận xét ngắn gọn, khích lệ, dùng ngôn ngữ cho trẻ em tiếng Việt)
        "tip": string (gợi ý cụ thể để làm giống hơn, ví dụ: "Mở miệng rộng hơn", "Nhướng mày lên")
      }
    `;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const analysisData = JSON.parse(cleanJson);

    res.status(200).json(analysisData);

  } catch (error) {
    console.error("Lỗi Gemini AI:", error);
    res.status(500).json({ 
      message: "AI đang bận, thử lại sau nhé!",
      isMatch: false,
      emoji: "🤖",
      tip: "Hãy thử kiểm tra lại kết nối internet."
    });
  }
};