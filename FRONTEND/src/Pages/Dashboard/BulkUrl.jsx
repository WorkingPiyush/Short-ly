import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {
  Upload,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import { createBulkUrl } from '@/Api/Url';
import { Link } from 'react-router-dom';


function BulkUrl() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState();
  const [dragActive, setDragActive] = useState(false);
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
      const data = await createBulkUrl(formData);
      setResponse(data);
      toast.success("File Uploaded !!");
    } catch (error) {
      console.error('Error uploading file:', error);
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

  return (
    <div className="min-h-screen bg-black text-white px-6 py-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl mb-3">
            Upload your file
          </h2>
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
          className={`relative border rounded-3xl p-12 transition-all duration-300 ${dragActive ? "border-emerald-400 bg-emerald-500/10" : "border-gray-700 bg-white/3"}`}>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload
              size={50}
              className={`mb-4 ${dragActive ? "text-emerald-400" : "text-gray-400"
                }`}
            />

            <h3 className="text-2xl font-medium">
              Drag & Drop Excel File
            </h3>

            <p className="text-gray-500 mt-2">
              or click to browse
            </p>
          </label>
        </div>

        {/* Uploaded File */}
        {file && (
          <div className='mt-6 flex justify-between items-center p-4'>
            <div className="bg-white/3 w-full border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
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
              <button onClick={removeFile} className="p-2 border border-gray-700 rounded-lg cursor-pointer hover:border-red-500">
                <Trash2 size={18} />
              </button>
            </div>
            <button aria-label='upload' onClick={handleUpload} className="flex justify-center items-center gap-4 py-4 px-4 border m-2 border-gray-700 bg-gray-950 rounded-lg cursor-pointer transition-all duration-150 delay-10 hover:border-emerald-400 hover:scale-103">
              <Upload
                size={18}
                className="text-emerald-400"
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
                <h3 className="text-4xl font-bold">
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
        {response && (<div className="rounded-2xl border border-gray-800 bg-white/3">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-900">
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
                <tr key={url.shortCode} className="border-b border-gray-900 hover:bg-white/2">
                  <td className="p-4 text-center">{idx + 1}</td>
                  <td className="p-4 text-center"><Link to={url.originalUrl} target='_blank'>{url?.originalUrl.split(".com")[0]}</Link></td>
                  <td className="p-4 text-center"> <Link to={url.shortUrl} target='_blank'>{url?.shortUrl}</Link></td>
                  <td className="p-2 capitalize">
                    <div className='inline-flex items-center h-full gap-2 px-3 py-1 cursor-pointer rounded-full bg-linear-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-400/20 text-emerald-300 text-xs font-medium shadow-[0_0_20px_rgba(16,185,129,0,0.15)] md:text-sm'>
                      <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7aa]" />
                      {url.isActive}
                    </div>
                  </td>
                  {/* <td className="p-4">{new Date(url?.creation_date)}</td> */}
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