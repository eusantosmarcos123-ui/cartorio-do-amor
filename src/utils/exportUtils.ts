import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export interface ExportProgressCallback {
  (step: 'rendering' | 'generating' | 'done' | 'error', message?: string): void;
}

/**
 * Fires a romantic confetti celebration (hearts, gold, rose)
 */
export function fireLoveConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#72092c', '#c5a059', '#ff4d6d']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#e8c4d0', '#ffd166', '#d4af37']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#881337', '#e8d5a7', '#ff758f']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#c5a059', '#ffffff', '#72092c']
  });
}

/**
 * Converts external image inside DOM to a Base64 data URL to avoid CORS/tainted canvas issues
 */
async function convertImgSrcToBase64(img: HTMLImageElement): Promise<void> {
  const src = img.getAttribute('src');
  if (!src || src.startsWith('data:image')) return;

  try {
    const response = await fetch(src, { mode: 'cors' });
    if (!response.ok) throw new Error('Fetch failed');
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    img.setAttribute('src', dataUrl);
    img.src = dataUrl;
  } catch {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous';
        tempImg.onload = () => {
          try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = tempImg.naturalWidth || 400;
            tempCanvas.height = tempImg.naturalHeight || 400;
            const ctx = tempCanvas.getContext('2d');
            if (!ctx) return reject(new Error('No context'));
            ctx.drawImage(tempImg, 0, 0);
            resolve(tempCanvas.toDataURL('image/png'));
          } catch (e) {
            reject(e);
          }
        };
        tempImg.onerror = reject;
        tempImg.src = src;
      });
      img.setAttribute('src', dataUrl);
      img.src = dataUrl;
    } catch (e) {
      console.warn('Could not convert external image to base64', e);
    }
  }
}

/**
 * Renders the certificate element to ultra-high resolution canvas (300+ DPI photographic fidelity)
 */
async function renderCertificateCanvas(sourceElement: HTMLElement): Promise<HTMLCanvasElement> {
  // Ensure all Google Fonts are completely ready
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Deep clone to isolate from live DOM and active zoom/transform
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  
  // Set clone dimensions to exact standard A4 ratio in pixels (794px x 1123px)
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.width = '794px';
  clone.style.minHeight = '1123px';
  clone.style.height = '1123px';
  clone.style.maxWidth = '794px';
  clone.style.maxHeight = '1123px';

  // Create isolated off-screen wrapper
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '794px';
  wrapper.style.height = '1123px';
  wrapper.style.zIndex = '-99999';
  wrapper.style.opacity = '1';
  wrapper.style.overflow = 'hidden';
  wrapper.style.pointerEvents = 'none';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // Convert all images to Base64
    const images = Array.from(clone.querySelectorAll('img'));
    await Promise.all(images.map((img) => convertImgSrcToBase64(img)));

    // Ensure fonts and styles are fully painted
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 120));

    // High fidelity rendering: scale 3.5 gives ~2780 x 3930 px (true 300 DPI)
    const canvas = await html2canvas(clone, {
      scale: 3.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      scrollX: 0,
      scrollY: 0,
      imageTimeout: 15000,
      onclone: (_clonedDoc, clonedElement) => {
        // Ensure perfect styling in cloned tree
        clonedElement.style.transform = 'none';
        clonedElement.style.boxShadow = 'none';

        // Explicitly guarantee certificate and contract headers are visible in the rendered canvas
        const hdr = clonedElement.querySelector('.certificate-header') as HTMLElement;
        if (hdr) {
          hdr.style.display = 'block';
          hdr.style.visibility = 'visible';
          hdr.style.opacity = '1';
        }
        const contractHdr = clonedElement.querySelector('.contract-header') as HTMLElement;
        if (contractHdr) {
          contractHdr.style.display = 'block';
          contractHdr.style.visibility = 'visible';
          contractHdr.style.opacity = '1';
        }
      }
    });

    return canvas;
  } finally {
    wrapper.remove();
  }
}

/**
 * Export ultra-high-resolution PDF tailored for standard A4 print (Zero lossy compression)
 */
export async function exportCertificateToPdf(
  element: HTMLElement, 
  filename: string = 'certidao-de-namoro.pdf',
  onProgress?: ExportProgressCallback
): Promise<void> {
  try {
    onProgress?.('rendering', 'Processando documento em altíssima resolução 300 DPI...');

    const canvas = await renderCertificateCanvas(element);

    onProgress?.('generating', 'Gerando arquivo PDF vetorial cristalino...');

    // Lossless PNG data URL ensures razor-sharp text and vibrant colors
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // A4 Portrait dimensions: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Use PNG format in jsPDF for crystal clear typography and zero artifacts
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'SLOW');
    pdf.save(filename);

    onProgress?.('done', 'Certidão baixada com sucesso em alta definição!');
    fireLoveConfetti();
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    onProgress?.('error', 'Falha ao gerar PDF. Tente novamente.');
    throw error;
  }
}

/**
 * Export ultra-high-resolution PNG image
 */
export async function exportCertificateToImage(
  element: HTMLElement, 
  filename: string = 'certidao-de-namoro.png',
  onProgress?: ExportProgressCallback
): Promise<void> {
  try {
    onProgress?.('rendering', 'Gerando imagem em altíssima definição (Ultra HD)...');

    const canvas = await renderCertificateCanvas(element);

    onProgress?.('generating', 'Preparando download da imagem...');

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    onProgress?.('done', 'Imagem salva com sucesso em alta fidelidade!');
    fireLoveConfetti();
  } catch (error) {
    console.error('Erro ao exportar Imagem:', error);
    onProgress?.('error', 'Falha ao salvar imagem.');
    throw error;
  }
}

/**
 * Native print trigger
 */
export function printCertificate(): void {
  window.print();
}

/**
 * Share via Web Share API or copy link
 */
export async function shareCertificateData(
  title: string,
  text: string
): Promise<{ method: 'share' | 'clipboard'; success: boolean }> {
  const sharePayload = {
    title,
    text,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(sharePayload)) {
    try {
      await navigator.share(sharePayload);
      return { method: 'share', success: true };
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        await copyToClipboard(window.location.href);
        return { method: 'clipboard', success: true };
      }
      return { method: 'share', success: false };
    }
  } else {
    await copyToClipboard(window.location.href);
    return { method: 'clipboard', success: true };
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (e) {
    console.error('Falha ao copiar texto:', e);
    return false;
  }
}
