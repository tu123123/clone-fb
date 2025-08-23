import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import fPdf from "./f.pdf";

import Tesseract from "tesseract.js";
 

export default function PdfViewer({ fileUrl }) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  useEffect(() => {
    const runOCR = async () => {
      const url = "/f.pdf"; // file pdf trong public folder
      const pdf = await pdfjsLib.getDocument(fPdf).promise;

      let allText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 }); // tăng scale cho nét

        // render page ra canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;

        // OCR ảnh từ canvas
        const { data: { text } } = await Tesseract.recognize(canvas, "eng", {
          logger: (m) => console.log(m), // log tiến trình
        });

        allText += `\n--- Page ${i} ---\n` + text;
      }

      console.log("📄 Kết quả OCR:", allText);
      alert(allText); // hiển thị text OCR
    };

    runOCR();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Đọc chữ từ PDF scan (OCR)</h2>


    </div>
  );
}