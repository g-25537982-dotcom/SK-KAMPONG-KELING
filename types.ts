export interface OPRData {
  schoolName: string;
  programName: string;
  date: string;
  venue: string;
  organizer: string;
  participants: string; // Sasaran
  objectives: string[];
  executiveSummary: string; // Impak / Laporan Ringkas
  images: string[]; // Base64 or ObjectURL strings
  preparedBy: string;
  verifiedBy: string;
}

export const INITIAL_DATA: OPRData = {
  schoolName: "SEKOLAH KEBANGSAAN CONTOH",
  programName: "",
  date: new Date().toISOString().split('T')[0],
  venue: "Dewan Sekolah",
  organizer: "Unit Kokurikulum",
  participants: "Semua Murid Tahap 2",
  objectives: ["Mengeratkan silaturrahim antara guru dan murid.", "Meningkatkan keceriaan kawasan sekolah."],
  executiveSummary: "",
  images: [],
  preparedBy: "Setiausaha Program",
  verifiedBy: "Guru Besar"
};

export interface GenerateReportRequest {
  programName: string;
  notes: string; // Rough notes from user
  tone?: 'formal' | 'enthusiastic';
}