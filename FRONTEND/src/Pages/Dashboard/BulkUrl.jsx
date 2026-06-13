import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {
  Upload,
  FileSpreadsheet,
  Trash2,
  Download,
} from "lucide-react";

const dummyData = [
  {
    id: 1001,
    customer: "John Doe",
    product: "Laptop",
    amount: "$1,250",
    status: "Completed",
  },
  {
    id: 1002,
    customer: "Jane Smith",
    product: "Mouse",
    amount: "$25",
    status: "Completed",
  },
  {
    id: 1003,
    customer: "Michael Brown",
    product: "Keyboard",
    amount: "$45",
    status: "Pending",
  },
  {
    id: 1004,
    customer: "Emily Davis",
    product: "Monitor",
    amount: "$190",
    status: "Completed",
  },
];

function BulkUrl() {
  const [file, setFile] = useState(null);
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
    if (droppedFile &&(droppedFile.name.endsWith(".xlsx") ||droppedFile.name.endsWith(".xls"))) {
      setFile(droppedFile);
    }
  };
  const removeFile = () => {
    setFile(null);
  };
  const handleUpload = () => {
    toast.success("File Uploaded !!");
    setFile(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
      default:
        return "bg-red-500/10 text-red-400 border border-red-500/30";
    }
  };

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

            <button className="flex items-center gap-2 px-5 py-3 border border-gray-700 rounded-xl hover:border-emerald-400">
              <Download size={18} />
              Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white/3">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="p-4 text-left">SERIAL</th>
                  <th className="p-4 text-left">ORGINAL URL</th>
                  <th className="p-4 text-left">SHORT URL</th>
                  <th className="p-4 text-left">CLICKS</th>
                  <th className="p-4 text-left">CREATION DATE</th>
                </tr>
              </thead>

              <tbody>
                {dummyData.map((row) => (
                  <tr key={row.id} className="border-b border-gray-900 hover:bg-white/2">
                    <td className="p-4">{row.id}</td>
                    <td className="p-4">{row.customer}</td>
                    <td className="p-4">{row.product}</td>
                    <td className="p-4">{row.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}
export default BulkUrl;