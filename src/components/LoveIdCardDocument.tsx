import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { CertificateData } from '../types/certificate';
import { calculateRelationshipTime, formatDateBR } from '../utils/dateUtils';
import { Heart, ShieldCheck } from 'lucide-react';

interface LoveIdCardDocumentProps {
  data: CertificateData;
}

export const LoveIdCardDocument: React.FC<LoveIdCardDocumentProps> = ({ data }) => {
  const timeInfo = useMemo(() => calculateRelationshipTime(data.startDate), [data.startDate]);

  return (
    <div
      id="certificate-document"
      className="relative w-[210mm] min-h-[297mm] h-[297mm] p-8 sm:p-10 select-none certificate-print-container flex flex-col items-center justify-center overflow-hidden shadow-2xl bg-[#fdfbf7] text-stone-900 font-sans"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Background Guilloché texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#059669 0.75px, transparent 0.75px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Frame border */}
      <div className="absolute inset-4 border-2 border-emerald-700/60 pointer-events-none rounded-xl" />

      {/* Page Title & Instructions */}
      <div className="text-center mb-6 z-10">
        <span className="text-[10px] tracking-[0.25em] font-bold text-emerald-800 uppercase">
          REPÚBLICA FEDERATIVA DO AMOR • DOCUMENTO DE IDENTIFICAÇÃO OFICIAL
        </span>
        <h1 className="font-display text-2xl font-black text-stone-900 uppercase mt-1">
          CARTEIRA DE IDENTIDADE DO CASAL (RG DO AMOR)
        </h1>
        <p className="text-xs text-stone-500">
          Documento oficial de porte obrigatório para casais apaixonados • Recorte e dobre para colocar na carteira
        </p>
      </div>

      {/* Realistic ID Card Replica Container (Frente & Verso) */}
      <div className="w-full max-w-xl bg-[#ecfdf5] border-2 border-emerald-800 rounded-2xl shadow-xl p-6 relative overflow-hidden z-10 space-y-6">
        
        {/* Top Header of the ID Card */}
        <div className="border-b-2 border-emerald-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-800 text-amber-200 flex items-center justify-center font-black text-xs shadow-sm">
              <Heart className="w-5 h-5 fill-amber-200" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold tracking-widest text-emerald-950">
                REPÚBLICA FEDERATIVA DO AMOR
              </p>
              <p className="text-xs font-black uppercase text-emerald-900">
                REGISTRO GERAL DE NAMORO & AFETO
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-emerald-800 font-bold">REGISTRO Nº</p>
            <p className="font-mono text-sm font-black text-emerald-950">
              {data.registryNumber || 'RG-2026-AMOR'}
            </p>
          </div>
        </div>

        {/* Card Body: Photo + Couple Data */}
        <div className="grid grid-cols-12 gap-5 items-center">
          
          {/* Photo Box (4 cols) */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-32 h-40 bg-white border-2 border-emerald-800 rounded-xl overflow-hidden shadow-md flex items-center justify-center relative">
              {data.photoUrl && data.showPhoto ? (
                <img
                  src={data.photoUrl}
                  alt="Foto do Casal"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-emerald-800">
                  <Heart className="w-10 h-10 mx-auto fill-emerald-800 text-emerald-800 mb-1" />
                  <span className="text-[9px] font-bold block uppercase">Foto do Casal</span>
                  <span className="text-[8px] text-emerald-600">3x4 Oficial</span>
                </div>
              )}
            </div>
            <span className="text-[9px] font-bold uppercase text-emerald-900 mt-2">
              CASAL OFICIAL
            </span>
          </div>

          {/* Details (8 cols) */}
          <div className="col-span-8 space-y-2.5 text-xs text-stone-900">
            <div>
              <span className="text-[9px] font-bold text-emerald-800 uppercase block">NOME DOS CONJUGES:</span>
              <p className="font-bold text-sm text-stone-950 truncate">
                {data.partner1 || 'Amor 1'} & {data.partner2 || 'Amor 2'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] font-bold text-emerald-800 uppercase block">DATA DE INÍCIO:</span>
                <p className="font-semibold text-stone-900">{formatDateBR(data.startDate)}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-800 uppercase block">TEMPO JUNTOS:</span>
                <p className="font-bold text-emerald-900">{timeInfo.compactBadge || 'Tempo Eterno'}</p>
              </div>
            </div>

            <div>
              <span className="text-[9px] font-bold text-emerald-800 uppercase block">FILIAÇÃO / CAUSA:</span>
              <p className="font-semibold text-stone-900">Unidos pelo Destino, Cumplicidade e Amor Verdadeiro</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] font-bold text-emerald-800 uppercase block">CIDADE & ESTADO:</span>
                <p className="font-semibold text-stone-900">{data.city || 'São Paulo'} - {data.state || 'SP'}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-800 uppercase block">VALIDADE:</span>
                <p className="font-bold text-rose-700 uppercase">INDETERMINADA (ETERNA)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer of the ID Card: Digital QR Code + Seal */}
        <div className="border-t-2 border-emerald-800 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white border border-emerald-800 rounded-md">
              <QRCodeSVG
                value={`https://cartorio-do-amor-nine.vercel.app/?rg=${encodeURIComponent(data.registryNumber || '2026')}`}
                size={48}
                level="M"
              />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-emerald-950">VÁLIDO EM TODO O TERRITÓRIO</p>
              <p className="text-[8px] text-emerald-800">Autenticado pelo Cartório do Amor Oficial</p>
            </div>
          </div>

          <div className="text-right">
            <div className="h-6 font-cursive text-sm text-emerald-900 font-bold">
              {data.signature1 || data.partner1} & {data.signature2 || data.partner2}
            </div>
            <p className="text-[8px] text-emerald-800 uppercase border-t border-emerald-800/40 pt-0.5">
              ASSINATURA DOS TITULARES
            </p>
          </div>
        </div>

      </div>

      {/* Security notice footer */}
      <div className="mt-6 text-center text-[10px] text-stone-500 z-10 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>Documento emitido pelo Cartório do Amor com valor sentimental e afetivo oficial irrevogável.</span>
      </div>
    </div>
  );
};
