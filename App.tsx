import React, { useState } from 'react';
import { OPRData, INITIAL_DATA } from './types';
import { OPRTemplate } from './components/OPRTemplate';
import { PhotoUploader } from './components/PhotoUploader';
import { generateReportContent } from './services/geminiService';
import { 
  Printer, 
  Sparkles, 
  LayoutTemplate, 
  Save, 
  RefreshCcw, 
  Loader2,
  ChevronRight,
  Pencil
} from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<OPRData>(INITIAL_DATA);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'ai'>('details');

  const handlePrint = () => {
    window.print();
  };

  const handleInputChange = (field: keyof OPRData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = value;
    setData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const addObjective = () => {
    setData(prev => ({ ...prev, objectives: [...prev.objectives, ""] }));
  };

  const removeObjective = (index: number) => {
    const newObjectives = data.objectives.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const handleAIGenerate = async () => {
    if (!data.programName || !aiPrompt) {
      alert("Sila masukkan Nama Program dan Nota ringkas untuk AI menjana laporan.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateReportContent({
        programName: data.programName,
        notes: aiPrompt
      });
      
      setData(prev => ({
        ...prev,
        executiveSummary: result.summary,
        objectives: result.objectives.length > 0 ? result.objectives : prev.objectives
      }));
      
      setActiveTab('details'); // Switch back to view result
    } catch (e) {
      alert("Gagal menjana laporan. Sila cuba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* Sidebar / Editor Area (Hidden on Print) */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden no-print z-10 shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-700">
            <LayoutTemplate className="w-6 h-6" />
            <h1 className="font-bold text-lg tracking-tight">OPR Sekolah AI</h1>
          </div>
          <button 
            onClick={handlePrint}
            className="p-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'details' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Pencil className="w-4 h-4" /> Butiran
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'photos' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <div className="relative">
               Gambar
               <span className="absolute -top-1 -right-2 bg-slate-200 text-[10px] px-1 rounded-full text-slate-600">{data.images.length}</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'ai' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles className="w-4 h-4" /> AI Assist
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* TAB: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Maklumat Asas</label>
                <input
                  type="text"
                  placeholder="Nama Sekolah"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                  value={data.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nama Program/Aktiviti"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm font-medium"
                  value={data.programName}
                  onChange={(e) => handleInputChange('programName', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Tarikh</label>
                   <input
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    value={data.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Tempat</label>
                   <input
                    type="text"
                    placeholder="Contoh: Dewan Terbuka"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    value={data.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Penganjur</label>
                   <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    value={data.organizer}
                    onChange={(e) => handleInputChange('organizer', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Sasaran</label>
                   <input
                    type="text"
                    placeholder="Contoh: Semua Murid"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    value={data.participants}
                    onChange={(e) => handleInputChange('participants', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Objektif</label>
                  <button onClick={addObjective} className="text-xs text-brand-600 font-medium hover:underline">+ Tambah</button>
                </div>
                {data.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-sm text-slate-400 py-2">{i + 1}.</span>
                    <input
                      type="text"
                      className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                      value={obj}
                      onChange={(e) => handleObjectiveChange(i, e.target.value)}
                    />
                    <button onClick={() => removeObjective(i)} className="text-red-400 hover:text-red-600">
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Laporan Ringkas</label>
                   <button 
                     onClick={() => setActiveTab('ai')}
                     className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200 transition"
                   >
                     <Sparkles className="w-3 h-3" /> Jana dgn AI
                   </button>
                </div>
                <textarea
                  rows={6}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm leading-relaxed"
                  value={data.executiveSummary}
                  onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
                  placeholder="Tulis laporan ringkas di sini..."
                />
              </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Disediakan Oleh</label>
                   <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    value={data.preparedBy}
                    onChange={(e) => handleInputChange('preparedBy', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Disahkan Oleh</label>
                   <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    value={data.verifiedBy}
                    onChange={(e) => handleInputChange('verifiedBy', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="animate-in fade-in duration-300">
              <PhotoUploader 
                images={data.images} 
                onChange={(imgs) => handleInputChange('images', imgs)} 
              />
              <p className="text-xs text-slate-500 mt-4 bg-yellow-50 p-3 rounded border border-yellow-100">
                Tips: Untuk hasil cetakan terbaik, gunakan gambar melintang (landscape). Anda boleh memuat naik sehingga 4 gambar.
              </p>
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-purple-900 font-bold flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Pembantu Laporan AI
                </h3>
                <p className="text-sm text-purple-700 mb-4">
                  Berikan nota ringkas (point form), dan AI akan menulis ayat penuh yang gramatis dan formal untuk laporan anda.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-purple-800 block mb-1">Nama Program</label>
                    <input 
                      className="w-full border-purple-200 rounded p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                      value={data.programName}
                      onChange={(e) => handleInputChange('programName', e.target.value)}
                      placeholder="Cth: Gotong Royong Perdana"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-purple-800 block mb-1">Nota Kasar / Apa yang berlaku?</label>
                    <textarea 
                      className="w-full border-purple-200 rounded p-2 text-sm focus:ring-purple-500 focus:border-purple-500 h-32"
                      placeholder="- Dimulakan dengan senamrobik&#10;- Ramai ibu bapa hadir&#10;- Cat bangunan blok A dan B&#10;- Tamat jam 12 tengah hari dengan jamuan"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                  </div>
                  
                  <button
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? "Sedang Menulis..." : "Jana Laporan & Objektif"}
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-400 text-center">
                Dikuasakan oleh Gemini 2.0 Flash
              </div>
            </div>
          )}

        </div>
        
        {/* Footer Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-center text-slate-400">
           &copy; {new Date().getFullYear()} OPR Sekolah AI. Privacy First: Data processed locally/via API.
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-200/50 p-4 md:p-8 overflow-y-auto flex justify-center items-start print:bg-white print:p-0 print:overflow-visible">
        <div 
          id="printable-area"
          className="scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 origin-top print:scale-100 print:transform-none transition-transform duration-300"
        >
          <OPRTemplate data={data} />
        </div>
      </div>

    </div>
  );
};

export default App;