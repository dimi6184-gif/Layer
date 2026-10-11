"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  MessageSquare,
  Bot,
  Shield,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Printer,
  X,
  FileText
} from "lucide-react";
import { getGuildTickets, getTicketTranscript, deleteTicketTranscript, createSampleTicketTranscript } from "@/actions/tickets";
import { toast } from "sonner";

interface TicketTranscriptViewerProps {
  discordId: string;
}

interface TicketSummary {
  id: string;
  guildId: string;
  ticketId: string;
  userId: string;
  userName: string;
  category: string | null;
  priority: string | null;
  aiHandled: boolean;
  aiResolved: boolean;
  escalated: boolean;
  escalationReason: string | null;
  messageCount: number;
  aiMessageCount: number;
  responseTime: number | null;
  createdAt: Date | string;
  closedAt: Date | string | null;
}

interface TicketMessageItem {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  isAI: boolean;
  aiConfidence: number | null;
  createdAt: Date | string;
}

const inputCls = "w-full rounded-xl px-3.5 py-2 text-sm outline-none transition-colors";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#F5F4F5",
};

/** Render rich Discord markdown (bold, italic, codeblocks, inline code, quotes, mentions, links) */
function formatDiscordText(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = "";

  lines.forEach((line, lineIndex) => {
    // Handle code blocks ```lang
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <div
            key={`cb-${lineIndex}`}
            className="my-2 p-3 rounded-lg font-mono text-xs overflow-x-auto select-text"
            style={{
              background: "#1e1f22",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#dbdee1",
            }}
          >
            {codeBlockLang && (
              <div className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: "#1FA7BB" }}>
                {codeBlockLang}
              </div>
            )}
            <pre className="whitespace-pre">{codeBlockLines.join("\n")}</pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLang = "";
        return;
      } else {
        // Start of code block
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeBlockLines = [];
        return;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Handle blockquotes >
    const isQuote = line.startsWith("> ");
    const contentLine = isQuote ? line.slice(2) : line;

    // Tokenize inline markdown
    const parts = contentLine.split(
      /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|`[^`]+`|<@!?\d+>|<#\d+>|<@&\d+>|https?:\/\/[^\s]+)/g
    );

    const formattedParts = parts.map((part, pIdx) => {
      if (!part) return null;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-bold" style={{ color: "#F5F4F5" }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={pIdx} className="italic text-zinc-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("__") && part.endsWith("__")) {
        return (
          <span key={pIdx} className="underline underline-offset-2">
            {part.slice(2, -2)}
          </span>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 rounded text-xs font-mono font-medium mx-0.5"
            style={{ background: "#2b2d31", color: "#f2f3f5" }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("<@") || part.startsWith("<#")) {
        return (
          <span
            key={pIdx}
            className="px-1 py-0.5 rounded text-xs font-medium mx-0.5 inline-block"
            style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}
          >
            {part.startsWith("<#") ? "#channel" : "@user"}
          </span>
        );
      }
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={pIdx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all"
            style={{ color: "#1FA7BB" }}
          >
            {part}
          </a>
        );
      }
      return <span key={pIdx}>{part}</span>;
    });

    if (isQuote) {
      elements.push(
        <div
          key={`line-${lineIndex}`}
          className="pl-3 py-0.5 my-1 rounded-sm border-l-4 text-xs italic"
          style={{ borderColor: "#4e5058", color: "#949ba4" }}
        >
          {formattedParts}
        </div>
      );
    } else {
      elements.push(
        <div key={`line-${lineIndex}`} className="min-h-[1.25rem] leading-relaxed">
          {formattedParts}
        </div>
      );
    }
  });

  return elements;
}

export function TicketTranscriptViewer({ discordId }: TicketTranscriptViewerProps) {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketSummary | null>(null);
  const [messages, setMessages] = useState<TicketMessageItem[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "closed" | "open">("all");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [isCreatingSample, setIsCreatingSample] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load transcript when selecting ticket
  const loadTranscript = useCallback(async (ticketId: string, ticketObj?: TicketSummary) => {
    setSelectedTicketId(ticketId);
    if (ticketObj) setSelectedTicket(ticketObj);
    setIsLoadingChat(true);
    try {
      const res = await getTicketTranscript(discordId, ticketId);
      if (res.ticket) setSelectedTicket(res.ticket as TicketSummary);
      setMessages(res.messages as TicketMessageItem[]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load transcript messages");
    } finally {
      setIsLoadingChat(false);
    }
  }, [discordId]);

  // Load tickets on mount or filter change
  const fetchTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    try {
      const res = await getGuildTickets(discordId, {
        search: searchQuery,
        status: statusFilter,
        limit: 100,
      });
      const list = res.tickets as TicketSummary[];
      setTickets(list);
      setTotalCount(res.totalCount);

      // Auto-select first ticket if none selected
      if (!selectedTicketId && list.length > 0) {
        loadTranscript(list[0].ticketId, list[0]);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setIsLoadingTickets(false);
    }
  }, [discordId, searchQuery, statusFilter, selectedTicketId, loadTranscript]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await getGuildTickets(discordId, {
          search: searchQuery,
          status: statusFilter,
          limit: 100,
        });
        if (!ignore) {
          const list = res.tickets as TicketSummary[];
          setTickets(list);
          setTotalCount(res.totalCount);
          setIsLoadingTickets(false);
          if (!selectedTicketId && list.length > 0) {
            loadTranscript(list[0].ticketId, list[0]);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setIsLoadingTickets(false);
          toast.error(err instanceof Error ? err.message : "Failed to load tickets");
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [discordId, searchQuery, statusFilter, selectedTicketId, loadTranscript]);

  // Generate demo transcript
  const handleCreateSample = async () => {
    setIsCreatingSample(true);
    try {
      const res = await createSampleTicketTranscript(discordId);
      toast.success("Sample ticket transcript generated!");
      await fetchTickets();
      if (res.ticketId) {
        await loadTranscript(res.ticketId);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create sample ticket");
    } finally {
      setIsCreatingSample(false);
    }
  };

  // Delete current transcript archive
  const handleDeleteTranscript = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this archived transcript? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteTicketTranscript(discordId, ticketId);
      toast.success("Transcript archive deleted");
      setSelectedTicketId(null);
      setSelectedTicket(null);
      setMessages([]);
      await fetchTickets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete transcript");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export transcript as JSON
  const handleExportJSON = () => {
    if (!selectedTicket) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ ticket: selectedTicket, messages }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `transcript-${selectedTicket.ticketId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Transcript downloaded as JSON");
  };

  // Print / HTML Print
  const handlePrint = () => {
    window.print();
  };

  // Filter messages based on in-chat search
  const filteredMessages = useMemo(() => {
    if (!chatSearchQuery.trim()) return messages;
    const q = chatSearchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        m.userName.toLowerCase().includes(q)
    );
  }, [messages, chatSearchQuery]);

  // Format date helper
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#F5F4F5" }}>
            <MessageSquare className="w-4 h-4" style={{ color: "#1FA7BB" }} /> Ticket Chat Archive
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(31,167,187,0.12)", color: "#1FA7BB" }}
            >
              {totalCount} {totalCount === 1 ? "Ticket" : "Tickets"}
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#A8A9A2" }}>
            Read and search closed support tickets directly in your browser with real-time Discord chat formatting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTickets()}
            disabled={isLoadingTickets}
            className="p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#A8A9A2",
            }}
            title="Refresh list"
          >
            <RefreshCw size={14} className={isLoadingTickets ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {tickets.length === 0 && !isLoadingTickets && (
            <button
              onClick={handleCreateSample}
              disabled={isCreatingSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: "#1FA7BB", color: "#101012" }}
            >
              <Sparkles size={13} />
              {isCreatingSample ? "Generating..." : "Generate Sample Ticket"}
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Tickets Sidebar (4 cols) */}
        <div
          className="lg:col-span-4 rounded-2xl p-3 space-y-3 flex flex-col h-[650px]"
          style={{
            background: "#121315",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Search & Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#A8A9A2" }}
              />
              <input
                type="text"
                placeholder="Search ticket, user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchTickets()}
                className={`${inputCls} pl-9 text-xs`}
                style={inputStyle}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchTickets();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#A8A9A2" }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              {(["all", "closed", "open"] as const).map((filter) => {
                const isActive = statusFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className="flex-1 py-1 text-[11px] font-medium rounded-lg capitalize transition-all"
                    style={{
                      background: isActive ? "rgba(31,167,187,0.12)" : "transparent",
                      color: isActive ? "#1FA7BB" : "#A8A9A2",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {isLoadingTickets ? (
              <div className="h-full flex flex-col items-center justify-center text-xs gap-2" style={{ color: "#A8A9A2" }}>
                <RefreshCw size={18} className="animate-spin" style={{ color: "#1FA7BB" }} />
                <span>Loading tickets...</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                <FileText size={28} style={{ color: "#52525B" }} />
                <p className="text-xs font-semibold" style={{ color: "#F5F4F5" }}>No tickets found</p>
                <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                  Tickets opened and closed by users in Discord will appear here.
                </p>
                <button
                  onClick={handleCreateSample}
                  disabled={isCreatingSample}
                  className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}
                >
                  Create demo ticket
                </button>
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicketId === t.ticketId;
                const isClosed = !!t.closedAt;

                return (
                  <div
                    key={t.id}
                    onClick={() => loadTranscript(t.ticketId, t)}
                    className="p-3 rounded-xl cursor-pointer transition-all text-left relative group"
                    style={{
                      background: isSelected
                        ? "rgba(31,167,187,0.08)"
                        : "rgba(255,255,255,0.02)",
                      border: isSelected
                        ? "1px solid rgba(31,167,187,0.3)"
                        : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      {/* User Tag */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{
                            background: isSelected ? "#174F49" : "rgba(255,255,255,0.06)",
                            color: isSelected ? "#1FA7BB" : "#F5F4F5",
                          }}
                        >
                          {t.userName ? t.userName.slice(0, 2).toUpperCase() : "US"}
                        </div>
                        <span className="text-xs font-semibold truncate" style={{ color: "#F5F4F5" }}>
                          {t.userName}
                        </span>
                      </div>

                      {/* Status badge */}
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0"
                        style={{
                          background: isClosed ? "rgba(255,255,255,0.05)" : "rgba(34,197,94,0.12)",
                          color: isClosed ? "#A8A9A2" : "#22C55E",
                        }}
                      >
                        {isClosed ? "Closed" : "Open"}
                      </span>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center justify-between text-[11px] gap-2" style={{ color: "#A8A9A2" }}>
                      <span className="truncate">
                        {t.category || "General Support"}
                      </span>
                      <span className="flex-shrink-0 text-[10px]">
                        {formatDate(t.closedAt || t.createdAt).split(",")[0]}
                      </span>
                    </div>

                    {/* Secondary tags */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {t.aiHandled && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1"
                          style={{ background: "rgba(31,167,187,0.12)", color: "#1FA7BB" }}
                        >
                          <Bot size={10} /> AI Handled
                        </span>
                      )}
                      {t.escalated && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
                        >
                          Escalated
                        </span>
                      )}
                      <span className="text-[10px] ml-auto font-mono" style={{ color: "#A8A9A2" }}>
                        {t.messageCount || 0} msgs
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Discord Chat Viewer (8 cols) */}
        <div
          className="lg:col-span-8 rounded-2xl flex flex-col h-[650px] overflow-hidden"
          style={{
            background: "#121315",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {!selectedTicket ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(31,167,187,0.08)", color: "#1FA7BB" }}
              >
                <MessageSquare size={28} />
              </div>
              <h3 className="text-base font-bold" style={{ color: "#F5F4F5" }}>Select a Ticket</h3>
              <p className="text-xs max-w-sm" style={{ color: "#A8A9A2" }}>
                Choose a ticket transcript from the list on the left to read its complete conversation history in live Discord formatting.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: "#F5F4F5" }}>
                      #{selectedTicket.ticketId.startsWith("sample-") ? selectedTicket.ticketId : `ticket-${selectedTicket.userName.toLowerCase()}`}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: selectedTicket.closedAt ? "rgba(255,255,255,0.06)" : "rgba(34,197,94,0.12)",
                        color: selectedTicket.closedAt ? "#A8A9A2" : "#22C55E",
                      }}
                    >
                      {selectedTicket.closedAt ? "Closed Ticket" : "Active Ticket"}
                    </span>
                    {selectedTicket.category && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(31,167,187,0.1)", color: "#1FA7BB" }}
                      >
                        {selectedTicket.category}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] mt-1 flex items-center gap-3 flex-wrap" style={{ color: "#A8A9A2" }}>
                    <span>Opened by <strong style={{ color: "#F5F4F5" }}>{selectedTicket.userName}</strong></span>
                    <span>•</span>
                    <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                    {selectedTicket.closedAt && (
                      <>
                        <span>•</span>
                        <span>Closed: {formatDate(selectedTicket.closedAt)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right toolbar controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* In-chat search */}
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#A8A9A2" }} />
                    <input
                      type="text"
                      placeholder="Find in chat..."
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="rounded-lg pl-7 pr-6 py-1 text-xs outline-none w-32 focus:w-44 transition-all"
                      style={inputStyle}
                    />
                    {chatSearchQuery && (
                      <button
                        onClick={() => setChatSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        style={{ color: "#A8A9A2" }}
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>

                  {/* Export JSON */}
                  <button
                    onClick={handleExportJSON}
                    className="p-1.5 rounded-lg text-xs flex items-center gap-1 hover:opacity-80 transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#A8A9A2" }}
                    title="Export as JSON"
                  >
                    <Download size={13} />
                    <span className="hidden sm:inline">JSON</span>
                  </button>

                  {/* Print / Save */}
                  <button
                    onClick={handlePrint}
                    className="p-1.5 rounded-lg text-xs flex items-center gap-1 hover:opacity-80 transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#A8A9A2" }}
                    title="Print or save PDF"
                  >
                    <Printer size={13} />
                  </button>

                  {/* Delete Archive */}
                  <button
                    onClick={() => handleDeleteTranscript(selectedTicket.ticketId)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-xs flex items-center gap-1 hover:opacity-80 transition-all text-red-400"
                    style={{ background: "rgba(239,68,68,0.1)" }}
                    title="Delete transcript archive"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Chat Stream Timeline */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-text"
                style={{
                  background: "#0c0d0e",
                }}
              >
                {isLoadingChat ? (
                  <div className="h-full flex flex-col items-center justify-center text-xs gap-2" style={{ color: "#A8A9A2" }}>
                    <RefreshCw size={20} className="animate-spin" style={{ color: "#1FA7BB" }} />
                    <span>Loading chat timeline...</span>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <MessageSquare size={24} style={{ color: "#52525B" }} />
                    <p className="text-xs font-semibold" style={{ color: "#F5F4F5" }}>
                      {chatSearchQuery ? "No matching messages found in this chat" : "No messages recorded for this ticket yet"}
                    </p>
                    <p className="text-[11px]" style={{ color: "#A8A9A2" }}>
                      {chatSearchQuery ? "Try searching for a different keyword." : "Messages sent in this ticket will be shown here."}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((msg, index) => {
                    const isTicketOpener = msg.userId === selectedTicket.userId;
                    const isBot = msg.isAI || msg.userName.includes("Bot") || msg.userName.includes("System");

                    return (
                      <div
                        key={msg.id || index}
                        className="flex items-start gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/[0.02]"
                      >
                        {/* Avatar */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 select-none overflow-hidden"
                          style={{
                            background: msg.isAI
                              ? "rgba(31,167,187,0.15)"
                              : isBot
                              ? "rgba(99,102,241,0.15)"
                              : "#174F49",
                            color: msg.isAI ? "#1FA7BB" : isBot ? "#818cf8" : "#F5F4F5",
                            border: msg.isAI
                              ? "1px solid rgba(31,167,187,0.3)"
                              : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {msg.isAI ? (
                            <Bot size={18} />
                          ) : isBot ? (
                            <Shield size={18} />
                          ) : (
                            msg.userName.slice(0, 2).toUpperCase()
                          )}
                        </div>

                        {/* Message Body */}
                        <div className="flex-1 min-w-0">
                          {/* Header row */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold" style={{ color: "#F5F4F5" }}>
                              {msg.userName}
                            </span>

                            {/* Role badges */}
                            {msg.isAI && (
                              <span
                                className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider"
                                style={{ background: "rgba(31,167,187,0.2)", color: "#1FA7BB" }}
                              >
                                AI Assistant
                              </span>
                            )}
                            {!msg.isAI && isBot && (
                              <span
                                className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider"
                                style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
                              >
                                Bot
                              </span>
                            )}
                            {isTicketOpener && !isBot && (
                              <span
                                className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider"
                                style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                              >
                                Author
                              </span>
                            )}

                            {/* Timestamp */}
                            <span className="text-[10px] ml-auto" style={{ color: "#71717A" }}>
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>

                          {/* Message Content */}
                          <div className="text-xs text-zinc-200 break-words leading-relaxed">
                            {formatDiscordText(msg.content)}
                          </div>

                          {/* AI Confidence Meter */}
                          {msg.isAI && msg.aiConfidence !== null && (
                            <div className="mt-2 flex items-center gap-2">
                              <div
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium"
                                style={{
                                  background:
                                    msg.aiConfidence >= 80
                                      ? "rgba(34,197,94,0.1)"
                                      : msg.aiConfidence >= 60
                                      ? "rgba(245,158,11,0.1)"
                                      : "rgba(239,68,68,0.1)",
                                  color:
                                    msg.aiConfidence >= 80
                                      ? "#22c55e"
                                      : msg.aiConfidence >= 60
                                      ? "#f59e0b"
                                      : "#ef4444",
                                  border: "1px solid rgba(255,255,255,0.06)",
                                }}
                              >
                                <Sparkles size={10} />
                                <span>AI Confidence: {Math.round(msg.aiConfidence)}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Footer Summary Bar */}
              <div
                className="p-3 flex items-center justify-between text-xs flex-shrink-0"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  color: "#A8A9A2",
                }}
              >
                <div className="flex items-center gap-3">
                  <span>
                    Total: <strong style={{ color: "#F5F4F5" }}>{messages.length}</strong> messages
                  </span>
                  {selectedTicket.aiHandled && (
                    <span>
                      • AI Handled: <strong style={{ color: "#1FA7BB" }}>Yes</strong>
                    </span>
                  )}
                  {selectedTicket.responseTime !== null && (
                    <span>
                      • First Response: <strong style={{ color: "#F5F4F5" }}>{selectedTicket.responseTime}s</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 size={13} style={{ color: "#1FA7BB" }} />
                  <span>Archived Transcript • Read-only</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
