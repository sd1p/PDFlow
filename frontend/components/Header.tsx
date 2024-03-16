"use client";
import usePDF from "@/hooks/UsePDF";
import { Logo } from "./Logo";
import { CirclePlus, File } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import axios from "axios";

const Header = () => {
  // ---States---
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ---Custom Hooks---
  const { pdfName, pdfNamespace, setPDF } = usePDF();

  //  ---Refs---
  const formRef = useRef<HTMLFormElement | null>(null);

  // ---Functions---
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file?.type === "application/pdf") {
      setLoading(true);
      setSelectedPDF(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setPDF(file.name, response.data.namespace);
      } catch (error) {
        toast.error("Error uploading PDF");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  // ---Render---
  return (
    <div className="flex flex-col h-[10vh] justify-center border-b-2 shadow-md">
      <div className="flex flex-row justify-between">
        <div className="ml-4">
          <Logo />
        </div>
        <div className="flex flex-row items-center mr-4">
          {pdfName !== "" ? (
            <div className="flex flex-row items-center justify-center mr-2 ">
              <span className="py-[6px] px-1 border-[1px] mx-1 rounded border-green-500">
                <File size={20} color="#0aab07" />
              </span>
              <p className="text-sm text-green-500">{pdfName}</p>
            </div>
          ) : (
            ""
          )}
          <label className="border-slate-500 cursor-pointer flex flex-row justify-center items-center border-[2px] p-[6px] rounded-md">
            {loading ? (
              <div className="p-[2px] sm:mr-2 flex justify-center items-center h-6">
                <span className="w-5 h-5 -mt-3">
                  <Spinner />
                </span>
              </div>
            ) : (
              <span className="sm:pr-2">
                <CirclePlus />
              </span>
            )}

            <span className="hidden sm:flex">Upload PDF</span>
            <input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Header;
