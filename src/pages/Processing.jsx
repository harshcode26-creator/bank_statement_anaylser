import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const initialSteps = [
  { key: "upload", label: "Uploading file", status: "loading" },
  { key: "read", label: "Reading statement", status: "pending" },
  { key: "extract", label: "Extracting transactions", status: "pending" },
  { key: "categorize", label: "Categorizing data", status: "pending" },
  { key: "finalize", label: "Finalizing analysis", status: "pending" },
];

function getStepStatus(index, activeIndex, isSuccess) {
  if (isSuccess || index < activeIndex) return "done";
  if (index === activeIndex) return "loading";
  return "pending";
}

export default function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [progress, setProgress] = useState(10);
  const [activeStep, setActiveStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = initialSteps.map((step, index) => ({
    ...step,
    status: getStepStatus(index, activeStep, isSuccess),
  }));

  useEffect(() => {
    if (!data) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= initialSteps.length - 1) {
          window.clearInterval(timer);
          setProgress(100);
          setIsSuccess(true);
          return currentStep;
        }

        setProgress(Math.min((currentStep + 2) * 20, 90));
        return currentStep + 1;
      });
    }, 1200);

    return () => {
      window.clearInterval(timer);
    };
  }, [data, navigate]);

  useEffect(() => {
    if (!data) {
      return undefined;
    }

    const successTimer = window.setTimeout(() => {
      setActiveStep(initialSteps.length - 1);
      setProgress(100);
      setIsSuccess(true);
    }, 1200);

    const redirectTimer = window.setTimeout(() => {
      navigate("/dashboard", { state: data });
    }, 1500);

    return () => {
      window.clearTimeout(successTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [data, navigate]);

  if (!data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#020617] px-4"
      >
        <div className="w-full max-w-[460px] rounded-xl border border-white/10 bg-slate-900/80 p-6 text-center">
          <h1 className="text-lg font-semibold text-white">No data available</h1>
          <p className="text-slate-400 mt-2 text-xs">Please upload statement.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#020617] px-4"
    >
      <div
        className={`w-full max-w-[460px] rounded-xl border border-white/10
             bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6
             transition-all duration-500 ${
               isSuccess ? "ring-2 ring-green-500/40" : ""
             }`}
      >
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold text-white">
            {isSuccess ? "Analysis Complete" : "Processing Your Statement"}
          </h1>
          <p className="text-slate-400 mt-2 text-xs">
            {isSuccess
              ? "Your dashboard is ready."
              : "Securely analysing your bank data. Please don't refresh."}
          </p>
        </div>

        <div className="flex justify-center mb-5">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center
                 transition-all duration-500 ${
                   isSuccess
                     ? "bg-green-500/20 scale-110"
                     : "bg-indigo-500/20"
                 }`}
          >
            {isSuccess ? (
              <svg
                className="w-7 h-7 text-green-400 animate-pop"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-indigo-400 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M22 12a10 10 0 01-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isSuccess
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.key}
              className="flex items-center gap-4 p-3 rounded-lg
                 border border-white/10 bg-white/5"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step.status === "done"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                {step.status === "done" ? (
                  <span>&#10004;</span>
                ) : (
                  <span className="animate-pulse">...</span>
                )}
              </div>

              <p className="text-xs text-slate-200">{step.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          &#128274; Your data is processed temporarily and never stored.
        </p>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0 }
          60% { transform: scale(1.2) }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-pop {
          animation: pop 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
