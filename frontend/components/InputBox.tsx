"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import useChat from "@/hooks/UseChat";
import axios from "axios";
import toast from "react-hot-toast";
import usePDF from "@/hooks/UsePDF";

const InputBox = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { appendChat } = useChat();
  const { pdfNamespace } = usePDF();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfNamespace === "") {
      appendChat({ owner: "USER", content: query });
      setQuery("");
      appendChat({
        owner: "ASSISTANT",
        content: "Please upload a PDF file first",
      });

      return;
    }
    if (!query) return;
    setLoading(true);
    appendChat({ owner: "USER", content: query });

    let data = JSON.stringify({
      query,
      namespace: pdfNamespace,
    });

    setQuery("");
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/conversation`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        appendChat({ owner: "ASSISTANT", content: response.data.output_text });
      })
      .catch((error) => {
        toast.error("Error: " + error.message);
      });

    setLoading(false);
  };

  return (
    <div className="h-[10vh] ">
      <form className="flex flex-row items-center justify-between px-3 py-2 mx-12 border-2 rounded-2xl border-slate-200 bg-slate-100 text-slate-black xl:mx-18 2xl:mx-48">
        <input
          disabled={loading}
          value={query}
          type="text"
          placeholder="Send a message"
          className="w-[100%] h-[4vh] bg-slate-100 placeholder-slate-300 focus:outline-none"
          onChange={(e) => setQuery(e.target.value)}
        />
        {!loading ? (
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-slate-100 hover:bg-gray-200"
          >
            <SendHorizontal size={28} color="#aeadad" strokeWidth={2.25} />
          </Button>
        ) : (
          <div className="flex flex-row items-center h-10 mr-4">
            <Spinner />
          </div>
        )}
      </form>
    </div>
  );
};

export default InputBox;
