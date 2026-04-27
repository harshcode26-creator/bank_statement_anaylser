import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircleIcon, FileTextIcon } from "../components/upload/UploadIcons.jsx"
import { useAuth } from "../context/AuthContext.jsx"

const SAMPLE_FILES = [
  { bank: "HDFC", path: "/HDFC_bank_statement.csv", filename: "HDFC_bank_statement.csv" },
  { bank: "ICICI", path: "/ICICI_bank_statement.csv", filename: "ICICI_bank_statement.csv" },
  { bank: "SBI", path: "/SBI_bank_statement.csv", filename: "SBI_bank_statement.csv" },
]

export default function Upload() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [loadingSample, setLoadingSample] = useState("")

  async function fetchSampleFile(path, filename) {
    const response = await fetch(path)

    if (!response.ok) {
      throw new Error(`Failed to fetch sample file: ${filename}`)
    }

    const blob = await response.blob()
    return new File([blob], filename, { type: "text/csv" })
  }

  const selectFiles = (nextFiles) => {
    if (!nextFiles.length) return

    setFiles(nextFiles)
    setIsSuccess(true)
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

  const handleUpload = () => {
    if (!files.length) return
    setIsUploading(true)
    setTimeout(() => {
      navigate("/processing", { state: { files } })
    }, 300)
  }

  const handleSampleSelect = async ({ bank, path, filename }) => {
    if (loadingSample) return

    try {
      setLoadingSample(bank)
      const file = await fetchSampleFile(path, filename)
      selectFiles([file])
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingSample("")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 bg-[#0b1220]"
    >
      <div className="absolute right-4 top-4 flex items-center gap-3">
        <span className="hidden sm:block max-w-[220px] truncate text-sm text-slate-300">
          {user?.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-white/5 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-md rounded-xl p-8 bg-slate-900 border border-white/5">
          <div className="flex justify-center mb-6">
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSuccess
                  ? "bg-green-500/20 text-green-400 scale-110"
                  : "bg-indigo-500/10 text-indigo-400"
              }`}
            >
              {!isSuccess ? (
                <FileTextIcon className="w-7 h-7" />
              ) : (
                <CheckCircleIcon className="w-7 h-7 " />
              )}
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center text-white mb-1 tracking-tight">
            Upload your bank statement
          </h1>
          <p className="text-sm text-center text-slate-400">
            PDF or CSV supported
          </p>

          <div
            className={`mt-6 border border-dashed rounded-xl p-6 text-center transition-colors duration-200 cursor-pointer ${
              isDragging
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-white/10 bg-slate-900/50 hover:bg-white/5 hover:border-white/20"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <p className="text-sm font-medium text-slate-300">
              Drag & Drop your file here
            </p>
            <p className="text-xs text-slate-500 my-2">or</p>
            <label className="inline-block px-4 py-2 rounded-lg text-sm transition-all duration-200 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer border border-white/5">
              Browse Files
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>

          {files.length > 0 && (
            <p className="text-xs text-center text-slate-400 mt-4">
              Selected file{files.length > 1 ? "s" : ""}:{" "}
              <span className="font-medium text-white">
                {files.map((file) => file.name).join(", ")}
              </span>
            </p>
          )}

          <button
            className={`w-full mt-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              files.length
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            disabled={!files.length || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? "Analyzing your statement..." : "Upload Statement"}
          </button>

          <p className="mt-5 text-xs text-center text-slate-500">
            <svg className="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your data is processed securely
          </p>
        </div>

        <div className="mt-4 w-full max-w-md text-center">
          <h2 className="text-sm font-semibold tracking-tight text-white">
            Try with sample data
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            No bank statement? Use one of these samples
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {SAMPLE_FILES.map((sample) => {
              return (
                <button
                  key={sample.bank}
                  type="button"
                  disabled={Boolean(loadingSample)}
                  onClick={() => handleSampleSelect(sample)}
                  className={`flex items-center justify-between rounded-lg border border-white/10 bg-slate-800/70 px-4 py-3 text-left transition-all duration-200 ${
                    loadingSample
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer hover:scale-[1.03] hover:shadow-lg hover:shadow-black/20"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{sample.bank}</p>
                  </div>
                  <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-300">
                    DEMO
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
