import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/common/Modal.jsx";
import { deleteUpload, getUploads, updateUpload } from "../services/api.js";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function getDisplayTitle(title) {
  if (!title || title === "Uploaded Statement") {
    return "Bank Statement";
  }

  return title;
}

function formatCreatedAt(createdAt) {
  if (!createdAt) return "-";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "-";

  return dateFormatter.format(date);
}

function formatNetAmount(amount) {
  const value = Number(amount ?? 0);
  const sign = value >= 0 ? "+" : "-";

  return `${sign}\u20B9${Math.abs(value).toLocaleString("en-IN")}`;
}

function sortUploadsByDate(uploads) {
  return [...uploads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export default function History() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTemporary] = useState(false);
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [actionUploadId, setActionUploadId] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [modalError, setModalError] = useState(null);

  const isActionRunning = Boolean(actionUploadId);

  useEffect(() => {
    let isMounted = true;

    const loadUploads = async () => {
      try {
        const data = await getUploads();
        if (!isMounted) return;

        setUploads(sortUploadsByDate(data));
        setError(null);
      } catch (fetchError) {
        if (!isMounted) return;

        console.error(fetchError);
        setError("Unable to load processing history.");
        setUploads([]);
      } finally {
        if (!isMounted) return;

        setLoading(false);
      }
    };

    loadUploads();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetModalState = () => {
    setShowRenameModal(false);
    setShowDeleteModal(false);
    setSelectedUpload(null);
    setRenameTitle("");
    setModalError(null);
  };

  const closeRenameModal = () => {
    if (isActionRunning) return;

    resetModalState();
  };

  const closeDeleteModal = () => {
    if (isActionRunning) return;

    resetModalState();
  };

  const goToUpload = (uploadId) => {
    setSelectedUploadId(uploadId);
    navigate(`/dashboard/${uploadId}`);
  };

  const openRenameModal = (event, upload) => {
    event.stopPropagation();

    setSelectedUpload(upload);
    setRenameTitle(getDisplayTitle(upload.title));
    setModalError(null);
    setShowRenameModal(true);
  };

  const openDeleteModal = (event, upload) => {
    event.stopPropagation();

    setSelectedUpload(upload);
    setModalError(null);
    setShowDeleteModal(true);
  };

  const handleRenameSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUpload) return;

    const nextTitle = renameTitle.trim();

    if (!nextTitle) {
      setModalError("Statement name is required.");
      return;
    }

    try {
      setActionUploadId(selectedUpload._id);
      const updatedUpload = await updateUpload(selectedUpload._id, {
        title: nextTitle,
      });

      setUploads((currentUploads) =>
        currentUploads.map((upload) =>
          upload._id === selectedUpload._id ? updatedUpload : upload,
        ),
      );
      setError(null);
      resetModalState();
    } catch (updateError) {
      console.error(updateError);
      setModalError("Unable to rename statement.");
    } finally {
      setActionUploadId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUpload) return;

    try {
      setActionUploadId(selectedUpload._id);
      await deleteUpload(selectedUpload._id);

      setUploads((currentUploads) =>
        currentUploads.filter((upload) => upload._id !== selectedUpload._id),
      );
      setError(null);
      resetModalState();
    } catch (deleteError) {
      console.error(deleteError);
      setModalError("Unable to delete statement.");
    } finally {
      setActionUploadId(null);
    }
  };

  return (
    <>
      <div className="px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Processing History
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Previously analyzed bank statements
          </p>
        </div>

        {isTemporary ? (
          <div
            className="bg-slate-800 border border-white/10 rounded-xl p-6
             text-center text-slate-400"
          >
            <p className="text-lg font-medium text-white mb-2">
              History unavailable
            </p>
            <p className="text-sm">
              You selected temporary processing. Enable persist mode to access
              history.
            </p>
          </div>
        ) : loading ? (
          <div className="text-slate-400 text-sm text-center py-16">
            Loading history...
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm text-center py-16">{error}</div>
        ) : uploads.length === 0 ? (
          <div className="text-slate-400 text-sm text-center py-16">
            No history yet
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => {
              const netAmount = Number(upload.summary?.net ?? 0);
              const isPositiveNet = netAmount >= 0;
              const isActionPending = actionUploadId === upload._id;

              return (
                <div
                  key={upload._id}
                  onClick={() => goToUpload(upload._id)}
                  aria-current={selectedUploadId === upload._id ? "true" : undefined}
                  className="bg-slate-800 border border-white/10 rounded-xl p-5
                   cursor-pointer hover:bg-slate-700/70 hover:border-indigo-400/40
                   hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.01]
                   transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">
                        {getDisplayTitle(upload.title)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatCreatedAt(upload.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${
                          isPositiveNet ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatNetAmount(netAmount)}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Click to view &rarr;
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>Transactions: {Number(upload.totalTransactions ?? 0)}</span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={(event) => openRenameModal(event, upload)}
                        className="text-slate-400 hover:text-indigo-300 disabled:opacity-50"
                      >
                        Rename
                      </button>
                      <span className="text-slate-600">|</span>
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={(event) => openDeleteModal(event, upload)}
                        className="text-slate-400 hover:text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showRenameModal}
        title="Rename Statement"
        onClose={closeRenameModal}
        closeDisabled={isActionRunning}
        footer={
          <>
            <button
              type="button"
              disabled={isActionRunning}
              onClick={closeRenameModal}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300
               transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="rename-statement-form"
              disabled={isActionRunning}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold
               text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isActionRunning ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <form id="rename-statement-form" onSubmit={handleRenameSubmit}>
          <label className="block text-sm font-medium text-slate-300">
            Statement name
            <input
              value={renameTitle}
              disabled={isActionRunning}
              onChange={(event) => {
                setRenameTitle(event.target.value);
                setModalError(null);
              }}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-800
               px-3 py-2 text-sm text-white outline-none transition
               placeholder:text-slate-500 focus:border-indigo-400"
              autoFocus
            />
          </label>

          {modalError && (
            <p className="mt-3 text-sm text-red-400">{modalError}</p>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        title="Delete Statement?"
        onClose={closeDeleteModal}
        closeDisabled={isActionRunning}
        footer={
          <>
            <button
              type="button"
              disabled={isActionRunning}
              onClick={closeDeleteModal}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300
               transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isActionRunning}
              onClick={handleDeleteConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold
               text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isActionRunning ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-slate-300">
            This action cannot be undone.
          </p>
          {selectedUpload && (
            <p className="text-sm font-medium text-white">
              {getDisplayTitle(selectedUpload.title)}
            </p>
          )}
          {modalError && (
            <p className="text-sm text-red-400">{modalError}</p>
          )}
        </div>
      </Modal>
    </>
  );
}
