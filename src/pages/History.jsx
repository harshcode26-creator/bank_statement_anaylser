import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

export default function History() {
  const location = useLocation();
  const data = location.state;
  const runs = useMemo(() => {
    if (!data) return [];

    return [
      {
        job_id: "current-analysis",
        bank_name: data.bankName ?? "-",
        created_at: new Date().toISOString(),
        net_cash_flow: Number(data.summary?.net ?? 0),
        total_transactions: Number(data.totalTransactions ?? data.preview?.length ?? 0),
      },
    ];
  }, [data]);
  const [loading] = useState(false);
  const [error] = useState(null);
  const [isTemporary] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const goToRun = (jobId) => {
    setSelectedJobId(jobId);
  };

  return (
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
      ) : !runs.length ? (
        <div className="text-slate-400 text-sm text-center py-16">
          No previous statements found.
        </div>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <div
              key={run.job_id}
              onClick={() => goToRun(run.job_id)}
              aria-current={selectedJobId === run.job_id ? "true" : undefined}
              className="bg-slate-800 border border-white/10 rounded-xl p-5
               cursor-pointer hover:bg-slate-700/70 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">
                    {run.bank_name} Bank
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(run.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    run.net_cash_flow >= 0 ? "text-green-400" : "text-sky-400"
                  }`}
                >
                  &#8377;{Math.abs(run.net_cash_flow).toLocaleString()}
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Transactions: {run.total_transactions}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
