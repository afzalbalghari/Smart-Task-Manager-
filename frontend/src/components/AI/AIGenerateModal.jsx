import { useState, useRef, useEffect } from "react";
import { aiService } from "../../services/aiService";
import { boardService } from "../../services/boardService";
import { taskService } from "../../services/taskService";
import {
  Sparkles, X, Wand2, ChevronRight, Plus, Check,
  Clock, AlertTriangle, Zap, RotateCcw, ArrowRight
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const PRIORITY_STYLES = {
  high:   { dot: "bg-red-400",     badge: "bg-red-500/15 text-red-400 border-red-500/30" },
  medium: { dot: "bg-amber-400",   badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  low:    { dot: "bg-emerald-400", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

const PHASE_COLORS = [
  "bg-violet-500/20 text-violet-300",
  "bg-sky-500/20 text-sky-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-amber-500/20 text-amber-300",
  "bg-rose-500/20 text-rose-300",
  "bg-cyan-500/20 text-cyan-300",
];

const EXAMPLE_PROMPTS = [
  "Build a portfolio website",
  "Create a machine learning model",
  "Write my thesis paper",
  "Launch a SaaS startup",
  "Design a mobile app UI",
  "Set up DevOps pipeline",
];

const STEPS = ["prompt", "generating", "review", "adding", "done"];

export default function AIGenerateModal({ boards, onClose, onTasksAdded }) {
  const [step,           setStep]           = useState("prompt");
  const [prompt,         setPrompt]         = useState("");
  const [priority,       setPriority]       = useState("medium");
  const [result,         setResult]         = useState(null);
  const [selectedTasks,  setSelectedTasks]  = useState(new Set());
  const [targetBoardId,  setTargetBoardId]  = useState("");
  const [targetListId,   setTargetListId]   = useState("");
  const [boardLists,     setBoardLists]     = useState([]);
  const [loadingLists,   setLoadingLists]   = useState(false);
  const [addingTasks,    setAddingTasks]    = useState(false);
  const [generatingDots, setGeneratingDots] = useState(0);
  const [addedCount,     setAddedCount]     = useState(0);
  const inputRef = useRef(null);

  // Auto-focus input
  useEffect(() => {
    if (step === "prompt") setTimeout(() => inputRef.current?.focus(), 50);
  }, [step]);

  // Animated dots while generating
  useEffect(() => {
    if (step !== "generating") return;
    const id = setInterval(() => setGeneratingDots(d => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, [step]);

  // Get phase → color mapping (stable per result)
  const phaseColorMap = {};
  if (result) {
    const phases = [...new Set(result.tasks.map(t => t.phase))];
    phases.forEach((ph, i) => { phaseColorMap[ph] = PHASE_COLORS[i % PHASE_COLORS.length]; });
  }

  // ── Generate ────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStep("generating");
    try {
      const data = await aiService.generate(prompt.trim(), priority);
      setResult(data);
      setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
      setStep("review");
    } catch {
      toast.error("Generation failed");
      setStep("prompt");
    }
  };

  // ── Board selection → load lists ────────────────────────────────────────
  const handleBoardChange = async (boardId) => {
    setTargetBoardId(boardId);
    setTargetListId("");
    setBoardLists([]);
    if (!boardId) return;
    setLoadingLists(true);
    try {
      const lists = await boardService.getLists(boardId);
      setBoardLists(lists);
      if (lists.length > 0) setTargetListId(lists[0].id);
    } catch { toast.error("Failed to load lists"); }
    finally { setLoadingLists(false); }
  };

  // ── Add tasks ───────────────────────────────────────────────────────────
  const handleAddTasks = async () => {
    if (!targetListId) { toast.error("Select a list first"); return; }
    const tasksToAdd = result.tasks.filter((_, i) => selectedTasks.has(i));
    if (!tasksToAdd.length) { toast.error("Select at least one task"); return; }

    setAddingTasks(true);
    setStep("adding");
    let count = 0;
    for (const [pos, task] of tasksToAdd.entries()) {
      try {
        await taskService.create({
          list_id:     targetListId,
          title:       task.title,
          description: task.description,
          priority:    task.priority,
          position:    pos,
          tags:        [task.phase],
        });
        count++;
        setAddedCount(count);
      } catch { /* skip failed tasks */ }
    }
    setAddingTasks(false);
    setStep("done");
    if (onTasksAdded) onTasksAdded(targetBoardId);
  };

  const toggleTask = (i) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedTasks(prev =>
      prev.size === result.tasks.length ? new Set() : new Set(result.tasks.map((_, i) => i))
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={step === "generating" || step === "adding" ? undefined : onClose}
      />

      {/* Modal */}
      <div className={clsx(
        "relative w-full bg-[#0d1117] border border-slate-700/60 rounded-2xl shadow-2xl",
        "flex flex-col overflow-hidden transition-all duration-300",
        step === "review" || step === "adding" || step === "done" ? "max-w-2xl max-h-[90vh]" : "max-w-lg"
      )}>

        {/* ── Glowing header ── */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-800">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-md" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl
                                flex items-center justify-center shadow-lg">
                  <Wand2 size={18} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">AI Task Generator</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {step === "prompt"     && "Describe your project to get a full task plan"}
                  {step === "generating" && "Analysing your project..."}
                  {step === "review"     && `${result?.tasks?.length} tasks generated · select which to add`}
                  {step === "adding"     && `Adding tasks... ${addedCount}/${selectedTasks.size}`}
                  {step === "done"       && `${addedCount} tasks added successfully!`}
                </p>
              </div>
            </div>
            {step !== "generating" && step !== "adding" && (
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mt-4">
            {["prompt","review","done"].map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={clsx(
                  "h-1 rounded-full transition-all duration-500",
                  step === s || (step === "generating" && s === "prompt") || (step === "adding" && s === "review")
                    ? "w-8 bg-violet-500"
                    : STEPS.indexOf(step) > STEPS.indexOf(s) ? "w-5 bg-violet-500/50" : "w-5 bg-slate-700"
                )} />
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP: Prompt ── */}
        {step === "prompt" && (
          <div className="p-6 space-y-5">
            {/* Prompt input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Project Description
              </label>
              <div className="relative">
                <textarea
                  ref={inputRef}
                  className={clsx(
                    "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pr-12",
                    "text-slate-100 placeholder-slate-600 resize-none text-sm leading-relaxed",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
                    "transition-all duration-200"
                  )}
                  rows={3}
                  placeholder="e.g. Build a portfolio website with React and Tailwind"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && prompt.trim()) { e.preventDefault(); handleGenerate(); } }}
                />
                <Sparkles size={16} className="absolute right-3 top-3.5 text-slate-600" />
              </div>
            </div>

            {/* Example prompts */}
            <div>
              <p className="text-xs text-slate-600 mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map(ex => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className={clsx(
                      "text-xs px-3 py-1.5 rounded-lg border transition-all duration-150",
                      prompt === ex
                        ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    )}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Default Priority
              </label>
              <div className="flex gap-2">
                {["low","medium","high"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={clsx(
                      "flex-1 py-2 rounded-lg text-xs font-medium border transition-all duration-150 capitalize",
                      priority === p
                        ? PRIORITY_STYLES[p].badge + " border-current"
                        : "border-slate-700 text-slate-500 hover:border-slate-600"
                    )}
                  >
                    <span className={clsx("inline-block w-1.5 h-1.5 rounded-full mr-1.5 mb-0.5",
                      PRIORITY_STYLES[p].dot)} />
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={clsx(
                "w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2",
                "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",
                "hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "shadow-lg shadow-violet-500/20 active:scale-[0.98]"
              )}
            >
              <Wand2 size={16} />
              Generate Task Plan
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* ── STEP: Generating ── */}
        {step === "generating" && (
          <div className="p-10 flex flex-col items-center justify-center gap-6">
            {/* Pulsing orb */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" style={{ animationDuration: "1.5s" }} />
              <div className="absolute inset-2 rounded-full bg-violet-500/20 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
              <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full
                              flex items-center justify-center shadow-xl shadow-violet-500/30">
                <Sparkles size={28} className="text-white animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-200 font-semibold text-base">
                Analysing your project{".".repeat(generatingDots)}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Building a tailored task plan for you
              </p>
            </div>

            {/* Animated steps */}
            <div className="space-y-2 w-full max-w-xs">
              {["Detecting project type", "Loading task templates", "Personalising to your prompt"].map((label, i) => (
                <div key={label} className="flex items-center gap-3 text-sm"
                     style={{ animation: `fadeIn 0.4s ease ${i * 0.3}s both` }}>
                  <div className="w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/40
                                  flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  </div>
                  <span className="text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Review ── */}
        {step === "review" && result && (
          <div className="flex flex-col overflow-hidden">
            {/* Meta bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-800/40 border-b border-slate-800">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="text-lg">{result.template_emoji}</span>
                  {result.template_label} plan
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Clock size={12} />
                  ~{result.total_estimated_hours}h total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAll}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {selectedTasks.size === result.tasks.length ? "Deselect all" : "Select all"}
                </button>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-violet-400 font-medium">
                  {selectedTasks.size}/{result.tasks.length} selected
                </span>
              </div>
            </div>

            {/* Task list */}
            <div className="overflow-y-auto flex-1 p-4 space-y-2" style={{ maxHeight: "340px" }}>
              {result.tasks.map((task, i) => {
                const selected = selectedTasks.has(i);
                const ps       = PRIORITY_STYLES[task.priority];
                const phColor  = phaseColorMap[task.phase] || PHASE_COLORS[0];
                return (
                  <div
                    key={i}
                    onClick={() => toggleTask(i)}
                    className={clsx(
                      "flex items-start gap-3 p-3 rounded-xl border cursor-pointer",
                      "transition-all duration-150 group",
                      selected
                        ? "bg-violet-500/8 border-violet-500/30 hover:border-violet-500/50"
                        : "bg-slate-800/30 border-slate-700/50 opacity-50 hover:opacity-70"
                    )}
                  >
                    {/* Checkbox */}
                    <div className={clsx(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5",
                      "transition-all duration-150",
                      selected ? "bg-violet-500 border-violet-500" : "border-slate-600 bg-transparent"
                    )}>
                      {selected && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-100">{task.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {/* Priority badge */}
                        <span className={clsx("text-xs px-1.5 py-0.5 rounded border flex items-center gap-1", ps.badge)}>
                          <span className={clsx("w-1 h-1 rounded-full", ps.dot)} />
                          {task.priority}
                        </span>
                        {/* Phase badge */}
                        <span className={clsx("text-xs px-1.5 py-0.5 rounded", phColor)}>
                          {task.phase}
                        </span>
                        {/* Hours */}
                        <span className="text-xs text-slate-600 flex items-center gap-0.5">
                          <Clock size={9} /> {task.hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Board + List selector */}
            <div className="border-t border-slate-800 px-6 py-4 space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Add to board</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Board</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                               text-sm text-slate-100 focus:outline-none focus:ring-2
                               focus:ring-violet-500/50 focus:border-violet-500/50"
                    value={targetBoardId}
                    onChange={e => handleBoardChange(e.target.value)}
                  >
                    <option value="">— Select board —</option>
                    {boards.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">List</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                               text-sm text-slate-100 focus:outline-none focus:ring-2
                               focus:ring-violet-500/50 focus:border-violet-500/50
                               disabled:opacity-40"
                    value={targetListId}
                    onChange={e => setTargetListId(e.target.value)}
                    disabled={!targetBoardId || loadingLists}
                  >
                    {loadingLists
                      ? <option>Loading...</option>
                      : boardLists.length === 0
                        ? <option value="">— Select board first —</option>
                        : boardLists.map(l => (
                            <option key={l.id} value={l.id}>{l.title}</option>
                          ))
                    }
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => { setStep("prompt"); setResult(null); }}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300
                             transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  <RotateCcw size={13} /> Regenerate
                </button>
                <button
                  onClick={handleAddTasks}
                  disabled={!targetListId || selectedTasks.size === 0}
                  className={clsx(
                    "ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm",
                    "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",
                    "hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200",
                    "disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20",
                    "active:scale-[0.98]"
                  )}
                >
                  <Plus size={15} />
                  Add {selectedTasks.size} Task{selectedTasks.size !== 1 ? "s" : ""}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: Adding ── */}
        {step === "adding" && (
          <div className="p-10 flex flex-col items-center justify-center gap-6">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle
                  cx="32" cy="32" r="28" fill="none"
                  stroke="url(#grad)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - addedCount / selectedTasks.size)}`}
                  style={{ transition: "stroke-dashoffset 0.4s ease" }}
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-violet-300">
                {addedCount}/{selectedTasks.size}
              </span>
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-semibold">Adding tasks to your board...</p>
              <p className="text-slate-500 text-sm mt-1">Almost there!</p>
            </div>
          </div>
        )}

        {/* ── STEP: Done ── */}
        {step === "done" && (
          <div className="p-10 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500
                              rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <Check size={28} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-100">{addedCount} tasks added!</p>
              <p className="text-slate-500 text-sm mt-1">
                Your {result?.template_label} task plan is ready to go
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setStep("prompt"); setResult(null); setPrompt(""); setAddedCount(0); }}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400
                           hover:border-slate-600 hover:text-slate-200 text-sm transition-all"
              >
                Generate Another
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600
                           text-white text-sm font-semibold hover:from-violet-500 hover:to-fuchsia-500
                           transition-all shadow-lg shadow-violet-500/20"
              >
                View Board →
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
