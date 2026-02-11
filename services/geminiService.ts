import { GoogleGenAI } from "@google/genai";
import { GenerateReportRequest } from "../types";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateReportContent = async (req: GenerateReportRequest): Promise<{ summary: string, objectives: string[] }> => {
  const client = getClient();
  
  const prompt = `
    Anda adalah pembantu admin sekolah yang pakar. Sila bantu saya menulis kandungan untuk Laporan Satu Halaman (One Page Report - OPR) bagi aktiviti sekolah.
    
    Maklumat Program:
    Nama: ${req.programName}
    Nota Kasar/Butiran: ${req.notes}
    
    Sila hasilkan output dalam format JSON sahaja tanpa markdown formatting (\`\`\`json ... \`\`\`) dengan struktur berikut:
    {
      "summary": "Satu perenggan laporan eksekutif yang formal (sekitar 80-100 patah perkataan) menceritakan perjalanan program dan impaknya dalam Bahasa Melayu baku.",
      "objectives": ["Objektif 1", "Objektif 2", "Objektif 3"]
    }
    
    Pastikan bahasa yang digunakan adalah formal, profesional, dan sesuai untuk laporan rasmi sekolah kerajaan Malaysia.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    const data = JSON.parse(responseText);
    
    return {
      summary: data.summary || "",
      objectives: data.objectives || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};