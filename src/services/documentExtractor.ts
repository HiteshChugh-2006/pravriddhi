import mammoth from 'mammoth';

export interface ExtractedDocument {
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  text: string;
  base64?: string;
  mimeType: string;
}

/**
 * Extracts plain text and base64 representation from uploaded PDF, DOCX, or TXT file.
 * Guaranteed to never fabricate text or inject demo profiles.
 */
export async function extractDocumentContent(file: File): Promise<ExtractedDocument> {
  const fileName = file.name;
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.txt')) {
    const text = await file.text();
    return {
      fileName,
      fileType: 'txt',
      text: text.trim(),
      mimeType: 'text/plain'
    };
  }

  if (lowerName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = (result.value || '').trim();
      return {
        fileName,
        fileType: 'docx',
        text,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
    } catch (err) {
      console.warn('Mammoth docx extraction warning, fallback to array buffer text:', err);
      const text = await file.text();
      return {
        fileName,
        fileType: 'docx',
        text: text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim(),
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
    }
  }

  if (lowerName.endsWith('.pdf')) {
    // Read base64 for Gemini multimodal
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    let extractedPdfText = '';
    try {
      // Dynamic import of pdfjs-dist
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      });
      const pdf = await loadingTask.promise;
      const pageTexts: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        if (pageText.trim()) {
          pageTexts.push(pageText);
        }
      }
      extractedPdfText = pageTexts.join('\n\n').trim();
    } catch (pdfErr) {
      console.warn('PDF.js in-browser text extraction note (falling back to base64 multimodal):', pdfErr);
    }

    return {
      fileName,
      fileType: 'pdf',
      text: extractedPdfText,
      base64: base64Data,
      mimeType: 'application/pdf'
    };
  }

  // Fallback generic read
  const text = await file.text();
  return {
    fileName,
    fileType: 'txt',
    text: text.trim(),
    mimeType: file.type || 'text/plain'
  };
}
