import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { CertificateData } from '../types/certificate';
import { calculateRelationshipTime, formatFullDatePortuguese, formatDateBR } from '../utils/dateUtils';
import { Scale, Feather } from 'lucide-react';

interface LoveContractDocumentProps {
  data: CertificateData;
}

export const LoveContractDocument: React.FC<LoveContractDocumentProps> = ({ data }) => {
  const [currentDate] = useState(() => new Date());
  const timeInfo = useMemo(() => calculateRelationshipTime(data.startDate), [data.startDate]);
  const issuedDateText = useMemo(() => formatFullDatePortuguese(currentDate), [currentDate]);

  return (
    <div
      id="certificate-document"
      className="relative w-[210mm] min-h-[297mm] h-[297mm] p-10 select-none certificate-print-container flex flex-col justify-between overflow-hidden shadow-2xl bg-[#fdfbf7] text-stone-900 font-serif"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Background Guilloché texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#b89758 0.75px, transparent 0.75px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Decorative Ornate Borders */}
      <div className="absolute inset-4 border-2 border-[#b89758] pointer-events-none rounded-sm" />
      <div className="absolute inset-6 border border-double border-[3px] border-[#b89758] pointer-events-none" />

      {/* Header */}
      <div className="contract-header relative text-center z-10 pt-2" data-contract-header="true">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Scale className="w-5 h-5 text-[#b89758]" />
          <span className="text-[11px] tracking-[0.3em] font-sans font-bold uppercase text-stone-600">
            REPÚBLICA AFETIVA DO BRASIL • CARTÓRIO DO AMOR
          </span>
          <Scale className="w-5 h-5 text-[#b89758]" />
        </div>

        <h1 className="font-display text-2xl font-black tracking-tight text-[#72092c] uppercase mt-2">
          CONTRATO OFICIAL DE CONVIVÊNCIA AFETIVA & AMOR ETERNO
        </h1>

        <div className="flex items-center justify-center gap-3 text-[10px] font-sans font-semibold text-stone-500 mt-1">
          <span>LIVRO DE PACTOS Nº {data.bookNumber || '001'}</span>
          <span>•</span>
          <span>FOLHA Nº {data.pageNumber || '001'}</span>
          <span>•</span>
          <span>REGISTRO DE AMOR Nº {data.registryNumber || '2026-0001'}</span>
        </div>

        <div className="w-48 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#b89758] to-transparent mt-3" />
      </div>

      {/* Contract Preamble & Parties */}
      <section className="relative z-10 text-xs sm:text-sm leading-relaxed space-y-4 px-4 text-justify">
        <p>
          Pelo presente instrumento particular de declaração solene, firmado perante as leis soberanas do coração, têm entre si, justo e contratado, como <strong>CONTRATANTES E PARCEIROS AFETIVOS</strong>:
        </p>

        <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-2 font-sans text-xs">
          <p>
            <strong className="text-stone-900 font-serif text-sm">PRIMEIRO(A) CONTRATANTE:</strong>{' '}
            <span className="text-[#72092c] font-bold text-sm">{data.partner1 || 'Primeiro Amor'}</span>, doravante denominado(a) simplesmente <strong>AMOR 1</strong>;
          </p>
          <p>
            <strong className="text-stone-900 font-serif text-sm">SEGUNDO(A) CONTRATANTE:</strong>{' '}
            <span className="text-[#72092c] font-bold text-sm">{data.partner2 || 'Segundo Amor'}</span>, doravante denominado(a) simplesmente <strong>AMOR 2</strong>.
          </p>
          <p className="text-[11px] text-stone-500 pt-1">
            Unidos desde <strong>{formatDateBR(data.startDate)}</strong> ({timeInfo.formattedText || 'Tempo Incalculável'}), sob a comarca afetiva de {data.city || 'São Paulo'} - {data.state || 'SP'}.
          </p>
        </div>

        {/* Clauses */}
        <div className="space-y-3 pt-1">
          <h2 className="text-center font-display font-bold text-xs uppercase tracking-wider text-stone-700">
            CLÁUSULAS CONTRATUAIS DO COMPROMISSO
          </h2>

          <div className="space-y-2 text-xs text-stone-800 leading-relaxed font-sans">
            <p>
              <strong>CLÁUSULA 1ª (DO AFETO & CUMPLICIDADE):</strong> As partes comprometem-se a cultivar carinho recíproco, lealdade inegociável, beijos de bom dia e abraços apertados em dias difíceis, sem prazo de expiração.
            </p>
            <p>
              <strong>CLÁUSULA 2ª (DA RESOLUÇÃO DE DIVERGÊNCIAS):</strong> Fica estabelecido que qualquer desentendimento será resolvido preferencialmente à base de diálogo sincero, cafuné e divisão justa da comida favorita do casal.
            </p>
            <p>
              <strong>CLÁUSULA 3ª (DOS VOTOS ESPECIAIS):</strong>{' '}
              <span className="italic font-serif">
                "{data.vows || 'Prometemos caminhar lado a lado, rir das bobeiras e construir memórias inesquecíveis todos os dias.'}"
              </span>
            </p>
            <p>
              <strong>CLÁUSULA 4ª (DA VALIDADE ETERNA):</strong> O presente pacto vigorará por tempo indeterminado e infinito, sendo irrevogável e irretratável.
            </p>
          </div>
        </div>
      </section>

      {/* Seal, QR Code & Signatures Footer */}
      <footer className="relative z-10 pt-4 border-t border-[#b89758]/40">
        <div className="flex items-center justify-between gap-6 px-4 mb-6">
          
          {/* QR Code Validation */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white border border-[#b89758] rounded-lg shadow-sm">
              <QRCodeSVG
                value={`https://cartorio-do-amor-nine.vercel.app/?contrato=${encodeURIComponent(data.registryNumber || '2026')}`}
                size={60}
                level="M"
              />
            </div>
            <div className="text-[10px] font-sans text-stone-500">
              <span className="font-bold block text-stone-800">Autenticidade Notarial</span>
              <span>Aponte para validar o contrato</span>
            </div>
          </div>

          {/* Golden Notary Seal */}
          <div className="w-16 h-16 rounded-full border-2 border-[#b89758] bg-gradient-to-br from-amber-100 to-amber-200 flex flex-col items-center justify-center text-center shadow-inner">
            <Feather className="w-5 h-5 text-[#b89758]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-[#72092c]">PACTO</span>
          </div>

          {/* Date and Location */}
          <div className="text-right text-[11px] font-sans text-stone-600">
            <p className="font-bold text-stone-800">{data.city || 'São Paulo'} - {data.state || 'SP'}</p>
            <p>{issuedDateText}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 px-6 pt-2">
          <div className="text-center">
            <div className="h-10 flex items-center justify-center font-cursive text-xl text-[#72092c]">
              {data.signature1 || data.partner1}
            </div>
            <div className="border-t border-stone-800 pt-1">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-800">{data.partner1 || 'Parceiro 1'}</p>
              <p className="text-[10px] text-stone-500">Contratante 1</p>
            </div>
          </div>

          <div className="text-center">
            <div className="h-10 flex items-center justify-center font-cursive text-xl text-[#72092c]">
              {data.signature2 || data.partner2}
            </div>
            <div className="border-t border-stone-800 pt-1">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-800">{data.partner2 || 'Parceiro 2'}</p>
              <p className="text-[10px] text-stone-500">Contratante 2</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
