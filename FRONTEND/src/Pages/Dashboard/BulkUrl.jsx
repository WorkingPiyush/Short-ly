import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {
  Upload,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import { createBulkUrl } from '@/Api/Url';
import { Link } from 'react-router-dom';
import StatusCard from '@/components/StatusCard';
import FullScreenLoader from '@/components/FullScreenLoader';


function BulkUrl() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState();
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) {
      setFile(droppedFile);
    }
  };
  const removeFile = () => {
    setFile(null);
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file)
    try {
      setIsLoading(true);
      const data = await createBulkUrl(formData);
      setResponse(data);
      toast.success("File Uploaded !!");
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
    setFile(null);
  };
  const formatDate = (date) => {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = new Date(date).getDate();
    const month = monthNames[new Date(date).getMonth()];
    const year = new Date(date).getFullYear();

    return `${day}-${month}-${year}`;
  }
  if (isLoading) return <FullScreenLoader />;
  return (
    <div className="min-h-screen darkbg-black bg-linear-to-br from-[#F6F3EE] via-[#FBFAF7] to-[#EEF8F2] dark:from-[#080808] dark:via-[#0b0b0b] dark:to-[#07110d] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl mb-3 dark:text-white text-black">
            Bulk URL Import
          </h1>
          <p className="text-gray-400">
            Upload an Excel file (.xlsx, .xls) and view processed results.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-3xl border-2 border-dashed cursor-pointer p-12 transition-all duration-300 ${dragActive ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : "border-[#DCCFBE] bg-[#FFF9F2] hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900/40"} p-14`}>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />

          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer" >
            <Upload size={50} className={`mb-4 ${dragActive ? "text-emerald-400 scale-120 rotate-10 transition-all duration-100" : "text-gray-400"}`} />

            <h3 className={`text-2xl font-medium dark:text-white text-zinc-700 ${dragActive && "scale-110"}`}>Drag & Drop Excel File</h3>

            <p className="text-gray-500 text-sm mt-2">
              Supports .xlsx and .xls • Max 10 MB
            </p>
          </label>
        </div>

        {/* Uploaded File */}
        {file && (
          <div className='mt-6 flex justify-between items-center p-4'>
            <div className="bg-[#FFFDF9] text-gray-800 p-2 dark:bg-zinc-900 border-[#E8DED2] dark:border-zinc-800
 rounded-2xl shadow-sm w-full border flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FileSpreadsheet
                  size={36}
                  className="text-emerald-400"
                />
                <div>
                  <p className="font-medium">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button onClick={removeFile} className="p-2 border border-gray-700 rounded-lg cursor-pointer hover:border-red-500 hover:text-red-500 hover:scale-105 transition-all duration-200 ease-linear">
                <Trash2 size={18} />
              </button>
            </div>
            <button aria-label='upload' onClick={handleUpload} className="flex justify-center items-center gap-4 py-4 px-4 border m-2  dark:border-gray-700 border-black/30 dark:bg-gray-950 bg-emerald-500 rounded-lg cursor-pointer transition-all duration-150 delay-10 hover:border-emerald-400 hover:scale-103">
              <Upload
                size={18}
                className="dark:text-emerald-400 text-white"
              />
              Upload
            </button>
          </div>
        )}

        {/* Results Section */}
        {response && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-4xl font-bold text-black dark:text-white">
                  Results
                </h3>
                <p className="text-gray-500">
                  Preview processed data
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Table */}
        {response && (<div className="rounded-3xl bg-[#F8F3EA] dark:bg-zinc-950 border border-[#E8DED2] dark:border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EAE3D8] dark:border-zinc-800 text-black dark:text-white">
                <th className="p-1 text-center text-sm">SERIAL</th>
                <th className="p-1 text-center text-sm">ORGINAL URL</th>
                <th className="p-1 text-center text-sm">SHORT URL</th>
                <th className="p-1 text-center text-sm">STATUS</th>
                <th className="p-1 text-center text-sm">CREATION DATE</th>
                <th className="p-1 text-center text-sm">EXPIRY DATE</th>
                <th className="p-1 text-center text-sm">PROTECTED</th>
              </tr>
            </thead>

            <tbody>
              {response?.map((url, idx) => (
                <tr key={url.shortCode} className="border-b border-[#EAE3D8] dark:border-zinc-800 text-black dark:text-white hover:bg-white/2">
                  <td className="p-4 text-center text-xs">{idx + 1}</td>
                  <td className="p-4 text-center text-xs"><Link to={url.originalUrl} target='_blank'>{url?.originalUrl.split(".com")[0]}</Link></td>
                  <td className="p-4 text-center text-xs"> <Link to={url.shortUrl} target='_blank'>{url?.shortUrl}</Link></td>
                  <td className="p-2 capitalize text-center">
                    <StatusCard status={url.isActive} />
                  </td>
                  <td className="p-4 text-xs text-center">{formatDate(url?.creation_date)}</td>
                  <td className="p-4 text-xs text-center">{formatDate(url?.expiry_date)}</td>
                  <td className="p-4 text-xs capitalize text-center">{url.isPswrdProtected ? "Yes" : "No"}</td>
                  <td className="p-4">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>)}
      </div>
    </div>
  );
}
export default BulkUrl;