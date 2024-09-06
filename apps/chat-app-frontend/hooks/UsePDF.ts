import { create } from "zustand";

type pdfState = {
  pdfName: string;
  documentId: string;
  setPDF: (pdfName: string, documentId: string) => void;
};

// custom hook for pdf state management
const usePDF = create<pdfState>((set) => ({
  pdfName: "",
  documentId: "",
  setPDF: (pdfName, documentId) => set({ pdfName, documentId }),
}));

export default usePDF;
