"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  Heart,
  ShieldAlert,
  Share2,
  Download,
  Copy,
  Check,
  Calendar,
  Flame,
  Crown,
  BookOpen,
  RefreshCw,
  Wand2,
  Zap,
  HelpCircle,
} from "lucide-react";
import {
  generateDiagnosis,
  DiagnosisMode,
  DiagnosisResult,
  RARITY_META,
  buildXShareText,
  getTodayDateString,
  PREFIXES,
  COOL_SUFFIXES,
  GAP_SUFFIXES,
} from "@/lib/dictionary";
import BikkurimanSticker from "@/components/BikkurimanSticker";

interface DiagnosisClientProps {
  initialName: string;
  initialMode: DiagnosisMode;
  initialDate?: string;
  autoShowResult?: boolean;
}

export default function DiagnosisClient({
  initialName,
  initialMode,
  initialDate,
  autoShowResult = false,
}: DiagnosisClientProps) {
  const [inputName, setInputName] = useState(initialName);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const isSampleName =
    !hasUserEdited &&
    (inputName.trim() === "れいな" || inputName.trim() === "山田太郎");
  const [mode, setMode] = useState<DiagnosisMode>(initialMode);
  const [result, setResult] = useState<DiagnosisResult | null>(() =>
    autoShowResult && initialName.trim()
      ? generateDiagnosis(initialName, initialMode, initialDate)
      : null
  );
  const [isSummoning, setIsSummoning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOgPreview, setShowOgPreview] = useState(false);
  const [showDictModal, setShowDictModal] = useState(false);
  const topAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    const doScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      topAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    doScroll();
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 100);
  }, []);

  const syncUrlParams = useCallback((targetName: string, targetMode: DiagnosisMode) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (targetName.trim()) {
      url.searchParams.set("name", targetName.trim());
      if (targetMode === "daily") {
        url.searchParams.set("mode", "daily");
        url.searchParams.set("date", getTodayDateString());
      } else {
        url.searchParams.delete("mode");
        url.searchParams.delete("date");
      }
    } else {
      url.searchParams.delete("name");
      url.searchParams.delete("mode");
      url.searchParams.delete("date");
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleDiagnose = (
    customName?: string,
    customMode?: DiagnosisMode,
    skipAnimation = false
  ) => {
    const targetName = (customName !== undefined ? customName : inputName).trim();
    const targetMode = customMode !== undefined ? customMode : mode;

    if (!targetName) return;

    // スマホでソフトキーボードが開いている場合、フォーカスを外してスクロール阻害を防ぐ
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    scrollToTop();

    if (skipAnimation) {
      const diag = generateDiagnosis(targetName, targetMode);
      setResult(diag);
      syncUrlParams(targetName, targetMode);
      scrollToTop();
      return;
    }

    setIsSummoning(true);
    setTimeout(() => {
      const diag = generateDiagnosis(targetName, targetMode);
      setResult(diag);
      setIsSummoning(false);
      syncUrlParams(targetName, targetMode);
      scrollToTop();
    }, 650);
  };

  const handleModeToggle = (newMode: DiagnosisMode) => {
    setMode(newMode);
    if (result && inputName.trim()) {
      handleDiagnose(inputName, newMode, false);
    }
  };

  const getShareUrl = () => {
    if (typeof window === "undefined" || !result) return "";
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set("name", result.name);
    if (result.mode === "daily") {
      params.set("mode", "daily");
      if (result.dateStr) params.set("date", result.dateStr);
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const getOgImageUrl = () => {
    if (!result) return "/api/og";
    const params = new URLSearchParams();
    params.set("name", result.name);
    if (result.mode === "daily") {
      params.set("mode", "daily");
      if (result.dateStr) params.set("date", result.dateStr);
    }
    return `/api/og?${params.toString()}`;
  };

  const handleShareX = () => {
    if (!result) return;
    const shareUrl = getShareUrl();
    const text = buildXShareText(result);
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${text}\n${shareUrl}`
    )}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyShareText = async () => {
    if (!result) return;
    const shareUrl = getShareUrl();
    const fullText = `${buildXShareText(result)}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleDownloadImage = async () => {
    if (!result || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(getOgImageUrl());
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `josou-futatsuna-${result.name}-${result.rarity}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setShowOgPreview(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const [samplePresets, setSamplePresets] = useState<
    { label: string; name: string; badge: string }[]
  >([]);

  useEffect(() => {
    let nName = "れいな";
    let rName = "かのん";
    let urName = "るな";
    let ssrName = "みお";
    let gapName = "あかり";

    for (let i = 1; i <= 1500; i++) {
      const candidate = `シンデレラ#${i}`;
      const d = generateDiagnosis(candidate, "standard");
      if (d.rarity === "N" && !d.isGap && nName === "れいな") {
        nName = candidate;
      }
      if (d.rarity === "R" && !d.isGap && rName === "かのん") {
        rName = candidate;
      }
      if (d.rarity === "UR" && urName === "るな") {
        urName = candidate;
      }
      if (d.rarity === "SSR" && !d.isGap && ssrName === "みお") {
        ssrName = candidate;
      }
      if (d.isGap && (d.rarity === "SR" || d.rarity === "SSR") && gapName === "あかり") {
        gapName = candidate;
      }
      if (
        nName !== "れいな" &&
        rName !== "かのん" &&
        urName !== "るな" &&
        ssrName !== "みお" &&
        gapName !== "あかり"
      )
        break;
    }

    setSamplePresets([
      { label: "Nサンプル", name: nName, badge: "N (紙シール)" },
      { label: "Rサンプル", name: rName, badge: "R (扇キラ)" },
      { label: "女装あるある15%枠", name: gapName, badge: "ギャップ" },
      { label: "SSRサンプル", name: ssrName, badge: "SSR (4.5%)" },
      { label: "UR傾国神話", name: urName, badge: "UR (0.5%)" },
    ]);
  }, []);

  const rarityInfo = result ? RARITY_META[result.rarity] : null;

  return (
    <div
      ref={topAnchorRef}
      className="relative min-h-screen flex flex-col items-center justify-between px-4 py-8 md:py-12 selection:bg-pink-500/30 selection:text-pink-200 [overflow-anchor:none]"
    >
      {/* 背景の小悪魔ゴシック＆ローズオーラ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-pink-600/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[380px] rounded-full bg-purple-800/15 blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[360px] h-[360px] rounded-full bg-rose-700/15 blur-[120px]" />
      </div>

      {/* メインコンテナ */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center [overflow-anchor:none]">
        {/* ガチャ召喚ローディング演出（最上部表示） */}
        {isSummoning && (
          <div className="w-full py-20 flex flex-col items-center justify-center bg-[#12060f]/80 border border-pink-500/35 rounded-3xl mb-10">
            <div className="relative w-24 h-24 flex items-center justify-center mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-amber-300/60 animate-ping" />
              <Sparkles className="w-10 h-10 text-pink-300 animate-pulse" />
            </div>
            <p className="text-pink-200 font-bold text-lg tracking-widest animate-pulse">
              秘密のコンパクトからA面の異名を召喚中...
            </p>
            <p className="text-pink-400/50 text-xs mt-1">
              MAKEUP SEED: 0x{generateDiagnosis(inputName || "れいな", mode).seed.toString(16).toUpperCase()}
            </p>
          </div>
        )}

        {/* 診断結果カード（生成時はページ最上部に表示） */}
        {!isSummoning && result && rarityInfo && (
          <div className="w-full space-y-6 animate-in fade-in duration-500 mb-10">
            {/* UR / SSR 出現時の特別バナー */}
            {rarityInfo.isUltraRare && (
              <div
                className={`w-full py-2.5 px-4 rounded-xl text-center font-black tracking-widest text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg ${
                  result.rarity === "UR"
                    ? "bg-gradient-to-r from-pink-500 via-amber-400 to-purple-500 text-white animate-pulse"
                    : "bg-gradient-to-r from-rose-400 via-amber-300 to-pink-500 text-stone-950"
                }`}
              >
                <Flame className="w-5 h-5 shrink-0" />
                <span>
                  ★ 激レア美少女出現！ 排出率 {rarityInfo.probability} の【{rarityInfo.nameJa}】を引き当てました！ ★
                </span>
                <Flame className="w-5 h-5 shrink-0" />
              </div>
            )}

            {/* 外枠（UR虹色 / SSRローズゴールド / SR・R輝き枠 / N控えめ枠） */}
            <div
              className={`p-[3px] rounded-3xl transition-all ${
                result.rarity === "UR"
                  ? "ur-rainbow-card"
                  : result.rarity === "SSR"
                  ? "ssr-gold-card"
                  : result.rarity === "SR"
                  ? "bg-gradient-to-b from-fuchsia-400/90 via-pink-500/70 to-amber-400/80 shadow-[0_0_45px_rgba(232,121,249,0.3)]"
                  : result.rarity === "R"
                  ? "bg-gradient-to-b from-pink-400/85 via-fuchsia-600/60 to-amber-400/70 shadow-[0_0_38px_rgba(236,72,153,0.28)]"
                  : "bg-stone-800/80 shadow-[0_0_16px_rgba(0,0,0,0.65)]"
              }`}
            >
              {/* カード本体 */}
              <article
                id="diagnosis-card"
                className="relative overflow-hidden rounded-[21px] bg-[#0e050c] px-5 py-7 sm:px-9 sm:py-9 text-pink-50"
              >
                {/* 背景の魔法陣ウォーターマーク */}
                <div className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 opacity-[0.07] magic-circle-spin">
                  <svg viewBox="0 0 200 200" className="w-full h-full stroke-pink-400 fill-none">
                    <circle cx="100" cy="100" r="90" strokeWidth="2" />
                    <circle cx="100" cy="100" r="75" strokeWidth="1" strokeDasharray="4 4" />
                    <polygon points="100,15 173,145 27,145" strokeWidth="1.5" />
                    <polygon points="100,185 173,55 27,55" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r="40" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* 四隅のゴシックオーナメント */}
                <div className="pointer-events-none absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-pink-400/70" />
                <div className="pointer-events-none absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-pink-400/70" />
                <div className="pointer-events-none absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-pink-400/70" />
                <div className="pointer-events-none absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-pink-400/70" />

                {/* カード上部：対象者名 ＆ レアリティ勲章 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-500/25">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-pink-300/80 tracking-widest uppercase">
                      <span>SECRET A-SIDE ARCHIVE</span>
                      <span>•</span>
                      <span>SEED #{result.seed.toString(16).toUpperCase().slice(0, 6)}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-pink-100 mt-1 flex flex-wrap items-center gap-2">
                      <span>{result.name} ちゃんのA面異名</span>
                      {result.mode === "daily" && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/90 border border-purple-400/50 text-purple-200">
                          今日の盛れ運勢 ({result.dateStr})
                        </span>
                      )}
                      {result.isGap ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-400/50 text-amber-200">
                          ⚡ 女装さんあるある枠 (15%)
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-400/40 text-pink-200">
                          ✦ 傾国の美少女枠 (85%)
                        </span>
                      )}
                    </h2>
                  </div>

                  {/* レアリティバッジ */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`relative overflow-hidden px-4 py-1.5 rounded-xl bg-gradient-to-r ${rarityInfo.badgeBg} font-black tracking-wider ${
                        result.rarity === "N"
                          ? "text-stone-300 border border-stone-600/80 shadow-inner"
                          : "shimmer-effect text-white shadow-lg border border-pink-200/60"
                      }`}
                    >
                      <span className="text-xs opacity-90 mr-1.5">RARITY</span>
                      <span className="text-xl sm:text-2xl">{result.rarity}</span>
                    </div>
                  </div>
                </div>

                {/* ビックリマン風 守護キャラ・キラシール召喚セクション */}
                <BikkurimanSticker result={result} />

                {/* カード中央：生成された二つ名 */}
                <div className="my-6 py-6 sm:py-7 px-3 sm:px-6 rounded-2xl bg-gradient-to-b from-[#1f0a1b]/90 via-[#150612] to-[#0d040b]/90 border border-pink-400/35 text-center relative shadow-inner overflow-hidden">
                  <p className="text-xs sm:text-sm text-pink-300/80 tracking-[0.25em] mb-2">
                    ― 鏡の向こうで覚醒せし二つ名 ―
                  </p>

                  <div className="max-w-xl mx-auto p-3.5 sm:p-5 rounded-xl border border-pink-400/40 bg-stone-950/80 shadow-lg font-black tracking-tight leading-snug break-words">
                    {/* 1段目：冠修飾語 */}
                    <div className="pb-1.5 mb-2 border-b border-pink-500/20">
                      <span
                        className={`block font-bold break-words ${
                          result.prefix.length >= 15
                            ? "text-sm sm:text-xl md:text-2xl"
                            : "text-base sm:text-2xl md:text-3xl"
                        } ${
                          result.rarity === "N" ? "text-stone-300/90" : "text-amber-200/95"
                        }`}
                      >
                        {result.prefix}
                      </span>
                    </div>

                    {/* 2段目：メイン二つ名 */}
                    <div>
                      <span
                        className={`inline-block max-w-full break-words bg-clip-text text-transparent bg-gradient-to-r ${
                          result.suffix.length >= 18
                            ? "text-base sm:text-2xl md:text-3xl"
                            : result.suffix.length >= 14
                            ? "text-lg sm:text-3xl md:text-4xl"
                            : result.suffix.length >= 10
                            ? "text-xl sm:text-3xl md:text-4xl"
                            : "text-2xl sm:text-4xl md:text-5xl"
                        } ${
                          result.rarity === "UR"
                            ? "from-pink-200 via-amber-200 to-purple-200 drop-shadow-[0_2px_18px_rgba(236,72,153,0.45)]"
                            : result.rarity === "N"
                            ? "from-stone-200 via-pink-100/85 to-stone-300"
                            : result.isGap
                            ? "from-amber-200 via-pink-300 to-rose-300 drop-shadow-[0_2px_18px_rgba(236,72,153,0.45)]"
                            : "from-pink-100 via-pink-300 to-amber-200 drop-shadow-[0_2px_18px_rgba(236,72,153,0.45)]"
                        }`}
                      >
                        『{result.suffix}』
                      </span>
                    </div>
                  </div>
                </div>

                {/* サブパラメーター2カラム：推定女子力 ＆ 固有スキル */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                  {/* 推定女子力ボックス */}
                  <div className="md:col-span-5 bg-[#140711]/90 border border-pink-500/30 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-pink-300/70">
                      <span className="flex items-center gap-1.5 font-bold text-pink-300">
                        <Heart className="w-4 h-4 text-pink-400" />
                        推定女子力（美貌戦闘力）
                      </span>
                      <span className="font-mono text-[11px] text-pink-300/50">BEAUTY POWER</span>
                    </div>

                    <div className="my-2 text-3xl sm:text-4xl font-black text-amber-300 tracking-tight font-mono">
                      {result.combatPowerFormatted}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-pink-950 text-pink-200/80">
                      <span>系統：{result.attribute}</span>
                      {result.combatPower < 100 && (
                        <span className="text-amber-300 font-bold">※すっぴん寝起き状態</span>
                      )}
                      {result.combatPower >= 530000 && (
                        <span className="text-pink-300 font-bold">※全人類が恋に落ちる</span>
                      )}
                    </div>
                  </div>

                  {/* 固有スキルボックス */}
                  <div className="md:col-span-7 bg-[#140711]/90 border border-pink-500/30 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-pink-300/70">
                      <span className="flex items-center gap-1.5 font-bold text-pink-300">
                        <Zap className="w-4 h-4 text-amber-300" />
                        固有メイク・自撮りスキル
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/15 text-pink-200 border border-pink-400/30">
                        常時発動
                      </span>
                    </div>

                    <div className="my-1.5 text-lg sm:text-xl font-black text-amber-200">
                      【{result.skill.name}】
                    </div>

                    <p className="text-xs sm:text-sm text-pink-100/85 leading-relaxed">
                      {result.skill.description}
                    </p>
                  </div>
                </div>

                {/* A面 5段階ステータスバー */}
                <div className="bg-[#140711]/75 border border-pink-500/25 rounded-xl p-4 mb-5">
                  <div className="text-xs text-pink-300 font-bold mb-3 flex items-center justify-between">
                    <span>◆ A面ヒロインステータス詳細 (HEROINE PARAMETERS)</span>
                    <span className="text-amber-200/80 font-normal">{rarityInfo.nameJa}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      { label: "メイク力", val: result.stats.make, color: "from-pink-500 to-rose-400" },
                      { label: "自撮り盛れ", val: result.stats.photo, color: "from-amber-400 to-yellow-300" },
                      { label: "小悪魔度", val: result.stats.devil, color: "from-purple-500 to-fuchsia-400" },
                      { label: "美脚・骨格", val: result.stats.style, color: "from-sky-400 to-indigo-400" },
                      { label: "変身ギャップ", val: result.stats.gap, color: "from-emerald-400 to-teal-300" },
                    ].map((st) => (
                      <div key={st.label} className="bg-[#0b0309]/90 p-2.5 rounded-lg border border-pink-950/80">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-pink-200/75">{st.label}</span>
                          <span className="font-mono font-bold text-amber-200">{st.val}</span>
                        </div>
                        <div className="w-full h-2 bg-[#060205] rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${st.color} rounded-full transition-all duration-700`}
                            style={{ width: `${st.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 二つ名の由来（1行フレーバーテキスト） */}
                <div className="bg-gradient-to-r from-pink-950/45 via-[#180814]/80 to-pink-950/45 border-l-4 border-pink-400 rounded-r-xl p-3.5 sm:p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-pink-300 font-bold tracking-wider">
                      二つ名の由来・極秘ドレッサー記録
                    </div>
                    <p className="text-xs sm:text-sm text-pink-100 mt-0.5 leading-relaxed">
                      {result.flavorText}
                    </p>
                  </div>
                </div>

                {/* カードフッター */}
                <div className="mt-5 pt-3 border-t border-pink-500/20 flex items-center justify-between text-[11px] text-pink-300/50">
                  <span>✦ 女装二つ名メーカー | A-SIDE STATUS GENERATOR</span>
                  <span className="text-pink-300 font-bold">#女装二つ名メーカー #女装さんと繋がりたい</span>
                </div>
              </article>
            </div>

            {/* シェア＆画像保存アクションエリア */}
            <section className="bg-[#160713]/90 border border-pink-500/35 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-pink-200 font-bold">
                  ＼ X（Twitter）でシェアすると、あなた専用の結果カード画像（OGP）が自動表示されます ／
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleShareX}
                  className="w-full py-4 px-5 rounded-xl bg-white hover:bg-pink-50 text-stone-950 font-black text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                  <span>X（Twitter）で結果をシェア</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 hover:brightness-110 text-stone-950 font-black text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {isDownloading ? "画像を生成中..." : "結果カード画像を保存 (PNG)"}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopyShareText}
                  className="px-4 py-2 rounded-lg bg-[#0c040a] hover:bg-pink-950/60 border border-pink-800/60 text-pink-200 text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">
                        投稿文とURLをコピーしました！
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-pink-400" />
                      <span>投稿文＆結果URLをコピー</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOgPreview((prev) => !prev)}
                  className="px-4 py-2 rounded-lg bg-[#0c040a] hover:bg-pink-950/60 border border-pink-800/60 text-pink-200 text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-pink-400" />
                  <span>
                    {showOgPreview
                      ? "動的OGPカード画像を隠す"
                      : "スマホ長押し保存用OGPカードを表示"}
                  </span>
                </button>
              </div>

              {showOgPreview && (
                <div className="pt-3 border-t border-pink-900/50 text-center space-y-2">
                  <p className="text-xs text-pink-200/70">
                    ▼ スマホの方は下の画像を長押しして「写真に保存」もできます
                  </p>
                  <div className="overflow-hidden rounded-xl border border-pink-400/40 bg-[#0b0309] max-w-xl mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getOgImageUrl()}
                      alt={`${result.name}ちゃんの女装二つ名診断結果カード`}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ヘッダー・タイトルセクション */}
        <header className="text-center mb-8 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/70 border border-pink-400/40 text-pink-200 text-xs md:text-sm tracking-widest mb-4 shadow-lg shadow-pink-950/50">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>魔法のコンパクトが暴く、あなたのA面称号と推定女子力</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider bg-gradient-to-b from-pink-100 via-pink-300 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(236,72,153,0.45)]">
            女装二つ名メーカー
          </h1>
          <p className="mt-3 text-pink-200/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            お名前（A面ネーム・アカウント名）から唯一無二の異名を召喚。
            <span className="text-amber-300 font-semibold">
              傾国の美少女85% × 女装さんリアルあるある15%
            </span>
            の小悪魔ガチャ診断！
          </p>
        </header>

        {/* 入力＆モード切替パネル */}
        <section className="w-full bg-gradient-to-b from-[#1a0916]/95 to-[#11050e]/95 border border-pink-500/40 rounded-2xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-md mb-8">
          {/* モード切り替えトグル */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 mb-5 border-b border-pink-500/20">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-pink-200">
              <BookOpen className="w-4 h-4 text-pink-400 shrink-0" />
              <span>鑑定モード選択：</span>
            </div>

            <div className="grid grid-cols-2 bg-[#0c040a] p-1 rounded-xl border border-pink-500/30 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleModeToggle("standard")}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === "standard"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25"
                    : "text-pink-300/60 hover:text-pink-200"
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>通常モード（名前固定）</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeToggle("daily")}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === "daily"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/25"
                    : "text-pink-300/60 hover:text-pink-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>今日の盛れ運勢（日替わり）</span>
              </button>
            </div>
          </div>

          {/* 名前入力フォーム */}
          <div className="mb-1.5 pl-1 flex items-center justify-between">
            <label
              htmlFor="name-input"
              className="text-xs sm:text-sm font-bold text-pink-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>ここに名前を入れてください</span>
            </label>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDiagnose();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                id="name-input"
                type="text"
                value={inputName}
                onFocus={(e) => {
                  if (isSampleName) {
                    e.target.select();
                  }
                }}
                onChange={(e) => {
                  setHasUserEdited(true);
                  setInputName(e.target.value);
                }}
                placeholder="A面のお名前やアカウント名を入力（例：れいな / @user）"
                maxLength={32}
                aria-label="診断する名前"
                className={`w-full px-4 py-3.5 sm:py-4 rounded-xl bg-[#0b0309]/90 border border-pink-500/40 placeholder-pink-300/35 text-base sm:text-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/25 transition-all ${
                  isSampleName ? "text-pink-300/40 font-medium" : "text-pink-50"
                }`}
              />
              {inputName && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pink-300/50">
                  {inputName.length}/32
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputName.trim() || isSummoning}
              className="px-7 py-3.5 sm:py-4 rounded-xl font-black text-base sm:text-lg bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 text-stone-950 hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-[0_0_25px_rgba(236,72,153,0.45)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Wand2 className={`w-5 h-5 ${isSummoning ? "animate-spin" : ""}`} />
              <span>{isSummoning ? "コンパクト詠唱中..." : "A面称号を覚醒させる"}</span>
            </button>
          </form>

          {/* クイック体験サンプル＆確率表ボタン */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-pink-300/70 mr-1">一発体験：</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setInputName(preset.name);
                    setHasUserEdited(preset.name !== "れいな" && preset.name !== "山田太郎");
                    setMode("standard");
                    handleDiagnose(preset.name, "standard", false);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#140711] hover:bg-pink-950/70 border border-pink-800/50 hover:border-pink-400/60 text-pink-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-amber-200 font-bold">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowDictModal(true)}
              className="text-xs text-pink-300/80 hover:text-pink-200 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>
                排出確率・収録ワード({PREFIXES.length + COOL_SUFFIXES.length + GAP_SUFFIXES.length}種)を見る
              </span>
            </button>
          </div>
        </section>
      </main>

      {/* 辞書データ・レアリティ確率モーダル */}
      {showDictModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDictModal(false)}
        >
          <div
            className="bg-[#12060f] border border-pink-400/50 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 text-pink-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
              <h3 className="text-lg font-black text-pink-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>小悪魔ガチャ仕様・収録辞書データ</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowDictModal(false)}
                className="text-sm px-3 py-1 rounded-lg bg-pink-950 hover:bg-pink-900 text-pink-200 cursor-pointer"
              >
                閉じる
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-amber-200">◆ レアリティ排出確率</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(["UR", "SSR", "SR", "R", "N"] as const).map((r) => (
                  <div
                    key={r}
                    className="p-2.5 rounded-lg bg-[#1a0916] border border-pink-900/60 text-center"
                  >
                    <div className="font-black text-base text-pink-300">{r}</div>
                    <div className="text-xs text-pink-200/70">{RARITY_META[r].probability}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-amber-200">
                ◆ 傾国の美少女85% × 女装さんリアルあるある15%
              </h4>
              <p className="text-pink-200/80 leading-relaxed">
                前半の修飾語（{PREFIXES.length}語）× 後半の称号（王道美少女{COOL_SUFFIXES.length}語 ＋ リアルあるある{GAP_SUFFIXES.length}語）により、合計{" "}
                <strong className="text-amber-300">
                  {(PREFIXES.length * (COOL_SUFFIXES.length + GAP_SUFFIXES.length)).toLocaleString()}
                </strong>{" "}
                通りの二つ名が生成されます。
              </p>
              <div className="bg-[#1a0916] p-3 rounded-xl border border-pink-900/60 space-y-2">
                <div className="text-pink-300 font-bold text-xs">
                  【15%で出現する女装さんあるあるギャップワード例】
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {GAP_SUFFIXES.slice(0, 18).map((w) => (
                    <span
                      key={w}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#0c040a] border border-pink-900/60 text-pink-200"
                    >
                      {w}
                    </span>
                  ))}
                  <span className="text-[11px] px-2 py-0.5 text-pink-300/60">
                    ...他 {GAP_SUFFIXES.length - 18} 語
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="relative z-10 mt-12 text-center text-xs text-pink-300/40">
        <p>女装二つ名メーカー — A-Side Heroine Status & Dynamic OGP Generator</p>
      </footer>
    </div>
  );
}
