# 📜 Cartório do Amor — Certidões Oficiais de Namoro & Afeto

> Aplicação web ultra moderna, responsiva e de alta conversão emocional para personalização, cálculo em tempo real e emissão de Certidões Oficiais de Namoro, Noivado e Vínculos Amorosos.

---

## 🌟 Principais Funcionalidades

1. **Split View Dinâmica (Desktop >= lg):**
   - **Painel Esquerdo (45%):** Editor interativo dividido em passos ágeis:
     - *Qualificação dos Cônjuges:* Nomes completos, data de início, comarca (cidade/UF) e números cartoriais simbólicos.
     - *Retrato do Casal:* Dropzone moderna (drag & drop, upload local via File API sem envio a servidores externos, prévia em moldura oval/polaroid/nobre e opção de foto demo).
     - *Cláusulas & Votos:* Textarea com contador de caracteres, botão de confirmação para limpar e **Assistente Afetivo com IA** (com temas: Romântico Apaixonado, Bem-humorado/Divertido, Cartorial Fofo, Geek/Gamer e Dramático/Literário).
     - *Caixa de Fontes & Tipografia:* Curadoria tipográfica de alta nobreza com 4 Presets em 1 clique (*Clássico Cartorial*, *Romance Editorial*, *Moderno & Limpo*, *Carta de Amor*) e seletores visuais individuais para Títulos (Cinzel, Playfair, Cormorant, Montserrat, Great Vibes), Corpo dos Votos (Playfair, EB Garamond, Plus Jakarta, Dancing Script) e Assinaturas (Great Vibes, Dancing Script, Alex Brush, Parisienne).
     - *Estilo & Selo:* 4 temas nobres (Clássico Imperial, Minimalista Rosé, Vintage Pergaminho, Noite Celestial) + 4 cores de Selo de Cera 3D (Rubi, Ouro, Esmeralda, Safira) + QR Code de autenticidade.
   - **Painel Direito (55%):** Live Preview Sticky com renderização instantânea a cada tecla digitada, controles fluidos de zoom (`Auto-Fit`, `100%`, `+`, `-`) sem cortes ou overflow lateral.

2. **Experiência Mobile Otimizada (< lg):**
   - Formulário ergonômico em tela cheia com Bottom Bar fixa contendo botões de acesso rápido: `[👁️ Espiar Certidão]` e `[⚡ Baixar PDF]`.
   - Gaveta/Modal de prévia animada via **Framer Motion**.

3. **Cálculo de Tempo em Tempo Real:**
   - Algoritmo que calcula com exatidão a idade da união em **anos, meses e dias**, além da contagem total de dias e a identificação da **Bodas** correspondente (Bodas de Algodão Doce, Plumas, Papel, Algodão, Trigo, Madeira, Estanho, etc.).

4. **Exportação & Compartilhamento de Alta Resolução:**
   - **PDF A4:** Geração via `html2canvas` (scale 2.5) + `jspdf` com medidas oficiais A4 (210mm x 297mm) sem cortes.
   - **Imagem PNG:** Exportação em altíssima qualidade pronta para stories de Instagram, TikTok e envio no WhatsApp.
   - **Impressão Nativa:** Regras `@media print` otimizadas para imprimir diretamente da impressora com margens limpas.
   - **Compartilhamento:** Integração com a Web Share API nativa e fallback para cópia de link na área de transferência com notificação flutuante.
   - **Celebração:** Explosão de confetes e corações via `canvas-confetti`.

---

## 🎨 Design System & Tokens Visuais

| Token | Hex / Valor | Aplicação |
|---|---|---|
| `primary` | `#72092c` (Borgonha Real) | Ações heróicas, brasões, títulos cartoriais nobres |
| `primary-hover` | `#580520` | Estados hover em botões primários |
| `accent` | `#c5a059` (Ouro Imperial) | Arabescos vetoriais, cantoneiras, molduras e medalhões |
| `surface` | `#faf8f5` (Marfim Suave) | Folha do documento (evita cansaço visual do branco puro) |
| `background` | `#fdfbf7` a `#f4efe6` | Fundo quente de acolhimento |
| `text-main` | `#1e1b18` | Contraste de texto WCAG AAA |
| `text-muted` | `#66615b` | Textos secundários e legendas de suporte |

---

## 🏗️ Estrutura de Pastas e Componentização

```
cartorio-do-amor/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ActionToolbar.tsx        # Botões de ação (PDF, PNG, Imprimir, Compartilhar)
│   │   ├── AiPromptModal.tsx        # Modal do gerador inteligente de votos por tom
│   │   ├── CertificateDocument.tsx  # O documento final (vetores SVG, brasão, selo, QR Code)
│   │   ├── EditorForm.tsx           # Painel de abas e campos do editor interativo
│   │   ├── Header.tsx               # Barra superior com logo, tema escuro e celebração
│   │   ├── MobilePreviewModal.tsx   # Modal e Bottom Bar dedicados para mobile
│   │   ├── PhotoUpload.tsx          # Dropzone, enquadramentos e processamento local
│   │   ├── PreviewPanel.tsx         # Contêiner sticky com auto-fit e controles de zoom
│   │   ├── ThemeSelector.tsx        # Seletores de papel, selo de cera e tipo de vínculo
│   │   └── Toast.tsx                # Sistema de feedback visual tátil
│   ├── constants/
│   │   └── initialData.ts           # Mock inicial apaixonante pré-carregado
│   ├── types/
│   │   └── certificate.ts           # Definições estritas TypeScript
│   ├── utils/
│   │   ├── aiVowsGenerator.ts       # Simulação da IA com categorias e placeholders dinâmicos
│   │   ├── dateUtils.ts             # Cálculos de tempo exato e datas por extenso em português
│   │   └── exportUtils.ts           # Pipeline html2canvas, jsPDF, compartilhamento e confetes
│   ├── App.tsx                      # Orquestrador de estado e layout split-view
│   ├── index.css                    # Tailwind CSS, regras @media print e texturas
│   └── main.tsx                     # Ponto de montagem React 19
├── index.html                       # Google Fonts (Cinzel, Playfair, Plus Jakarta, Great Vibes)
├── tailwind.config.js               # Tokens semânticos e tipografias estendidas
└── package.json
```

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- Node.js instalado (v18+ recomendado).

### 2. Instalação e Execução
```bash
# Entre na pasta do projeto
cd cartorio-do-amor

# Instale as dependências (já executado e verificado)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### 3. Build para Produção
```bash
npm run build
```
O build estático e otimizado será gerado na pasta `dist/`.
