import { create } from "zustand";

type pdfState = {
  pdfName: string;
  pdfNamespace: string;
  setPDF: (pdfName: string, pdfNamespace: string) => void;
};

const usePDF = create<pdfState>((set) => ({
  pdfName: "",
  pdfNamespace: "",
  setPDF: (pdfName, pdfNamespace) => set({ pdfName, pdfNamespace }),
}));

export default usePDF;
