import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircleIcon, FileTextIcon } from "../components/upload/UploadIcons.jsx"
import { uploadFiles } from "../services/api.js"

export default function Upload() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")

  const selectFiles = (nextFiles) => {
    if (!nextFiles.length) return

    setFiles(nextFiles)
    setIsSuccess(true)
    setMessage("")
  }

  const handleFileChange = (event) => {
    selectFiles(Array.from(event.target.files || []))
  }

  const onDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    selectFiles(Array.from(event.dataTransfer.files || []))
  }

  const onDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const handleUpload = async () => {
    if (!files.length) return

    setLoading(true)
    setMessage("")

    try {
      const data = await uploadFiles(files)

      console.log(data)
      navigate(`/dashboard/${data.uploadId}`)
    } catch (error) {
      console.error(error)
      setMessage("Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4
             bg-gradient-to-b from-[#0b1220] to-[#111827]"
    >
      <div
        className="w-full max-w-md rounded-2xl p-8
               bg-slate-800/90 border border-white/10
               shadow-2xl backdrop-blur"
      >
        <div className="flex justify-center mb-6">
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center
                   shadow-lg transition-all duration-300 ${
                     isSuccess
                       ? "bg-green-500 scale-110"
                       : "bg-gradient-to-br from-indigo-500 to-violet-600 hover:scale-110"
                   }`}
          >
            {!isSuccess ? (
              <FileTextIcon className="w-9 h-9 text-white" />
            ) : (
              <CheckCircleIcon className="w-9 h-9 text-white animate-bounce" />
            )}
          </div>
        </div>

        <h1 className="text-xl font-semibold text-center text-white">
          Bank Statement Analyzer
        </h1>
        <p className="text-sm text-center text-slate-400 mt-1">
          Upload your bank statement for instant analysis
        </p>

        <div
          className={`mt-6 border-2 border-dashed rounded-xl p-6 text-center
                 transition-all duration-300 ${
                   isDragging
                     ? "border-indigo-400 bg-indigo-500/10"
                     : "border-white/20 bg-slate-900/40"
                 }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <p className="text-sm font-medium text-slate-200">
            Drag & Drop your file here
          </p>

          <p className="text-xs text-slate-400 my-2">or</p>

          <label
            className={`inline-block px-4 py-2 rounded-md text-sm transition-all ${
              loading
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            }`}
          >
            Browse Files
            <input
              type="file"
              className="hidden"
              multiple
              disabled={loading}
              onChange={handleFileChange}
            />
          </label>

          <p className="text-xs text-slate-500 mt-3">
            Supported formats: PDF, CSV, Excel
          </p>
        </div>

        {files.length > 0 && (
          <p className="text-xs text-center text-slate-300 mt-3">
            Selected file{files.length > 1 ? "s" : ""}:{" "}
            <span className="font-medium">
              {files.map((file) => file.name).join(", ")}
            </span>
          </p>
        )}

        <button
          className={`w-full mt-6 py-3 rounded-lg text-sm font-semibold
                 transition-all duration-300 active:scale-95 ${
                   files.length
                     ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
                     : "bg-slate-700 text-slate-400 cursor-not-allowed"
                 }`}
          disabled={!files.length || loading}
          onClick={handleUpload}
        >
          {loading ? "Processing..." : "Analyze Statement"}
        </button>

        {message && (
          <p className="mt-3 text-xs text-center text-green-400">{message}</p>
        )}

        <p className="mt-4 text-xs text-center text-slate-500">
          &#128274; Your data is processed temporarily in memory and discarded.
        </p>
      </div>
    </div>
  )
}
