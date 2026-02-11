import React from 'react';
import { OPRData } from '../types';

interface OPRTemplateProps {
  data: OPRData;
}

export const OPRTemplate: React.FC<OPRTemplateProps> = ({ data }) => {
  // Ensure we always have 4 slots for rendering
  const imageSlots = [0, 1, 2, 3];

  return (
    <div className="a4-paper p-[15mm] text-black text-sm relative flex flex-col h-full font-serif leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 text-center">
        <h1 className="text-xl font-bold uppercase tracking-wide mb-1 leading-tight">{data.schoolName}</h1>
        <h2 className="text-lg font-bold uppercase mb-2">Laporan Aktiviti (One Page Report)</h2>
      </div>

      {/* Info Grid */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-black">
          <tbody>
            <tr>
              <td className="border border-black bg-slate-100 p-2 font-bold w-1/4">Nama Program</td>
              <td className="border border-black p-2 font-medium" colSpan={3}>{data.programName || "-"}</td>
            </tr>
            <tr>
              <td className="border border-black bg-slate-100 p-2 font-bold">Tarikh</td>
              <td className="border border-black p-2">{data.date || "-"}</td>
              <td className="border border-black bg-slate-100 p-2 font-bold">Tempat</td>
              <td className="border border-black p-2">{data.venue || "-"}</td>
            </tr>
            <tr>
              <td className="border border-black bg-slate-100 p-2 font-bold">Penganjur</td>
              <td className="border border-black p-2">{data.organizer || "-"}</td>
              <td className="border border-black bg-slate-100 p-2 font-bold">Sasaran</td>
              <td className="border border-black p-2">{data.participants || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Objectives */}
      <div className="mb-4">
        <h3 className="font-bold border-b border-black mb-2 inline-block">Objektif Program</h3>
        <ol className="list-decimal list-inside pl-2 space-y-1">
          {data.objectives.length > 0 ? (
            data.objectives.map((obj, i) => <li key={i}>{obj}</li>)
          ) : (
            <li className="text-slate-400 italic">Tiada objektif dinyatakan...</li>
          )}
        </ol>
      </div>

      {/* Executive Summary */}
      <div className="mb-6">
        <h3 className="font-bold border-b border-black mb-2 inline-block">Laporan Ringkas / Impak</h3>
        <p className="text-justify whitespace-pre-wrap">
          {data.executiveSummary || <span className="text-slate-400 italic">Laporan program akan dipaparkan di sini...</span>}
        </p>
      </div>

      {/* Images Grid */}
      <div className="flex-1 mb-6">
        <h3 className="font-bold border-b border-black mb-4 inline-block">Dokumentasi Bergambar</h3>
        <div className="grid grid-cols-2 gap-4">
          {imageSlots.map((idx) => {
            const img = data.images[idx];
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full aspect-video border border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center relative">
                  {img ? (
                    <img src={img} alt={`Gambar ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-300 text-xs italic flex flex-col items-center">
                       <span>Ruang Gambar {idx + 1}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs mt-1 italic text-slate-600">Gambar {idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-auto pt-8">
        <div className="text-center">
          <p className="mb-12 text-xs">Disediakan Oleh:</p>
          <div className="border-b border-dotted border-black w-3/4 mx-auto mb-1"></div>
          <p className="font-bold uppercase text-xs">({data.preparedBy})</p>
        </div>
        <div className="text-center">
          <p className="mb-12 text-xs">Disahkan Oleh:</p>
          <div className="border-b border-dotted border-black w-3/4 mx-auto mb-1"></div>
          <p className="font-bold uppercase text-xs">({data.verifiedBy})</p>
        </div>
      </div>
    </div>
  );
};