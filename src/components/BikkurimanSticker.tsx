"use client";

import React, { useState } from "react";
import { RotateCw, Sparkles } from "lucide-react";
import { DiagnosisResult } from "@/lib/dictionary";
import {
  ARCHETYPE_META,
  getAttributePalette,
  getBikkurimanArchetype,
  getPrismTypeLabel,
} from "@/lib/bikkuriman";

interface BikkurimanStickerProps {
  result: DiagnosisResult;
}

/**
 * シール表面の二つ名（修飾語＋メイン称号）を視認性高く美麗に描画するヘルパー
 */
function renderStickerTitle(
  prefix: string,
  suffix: string,
  isNormal: boolean
) {
  // 括弧付きの二つ名（例: 幻影の美神（ヴィーナス）、ウインク一発の狙撃手（スナイパー））
  const parenMatch = suffix.match(/^(.*?)[（(](.*?)[）)]$/);

  // 漢字の潰れを防ぐ8方向の外周シャドウアウトライン（-webkit-text-strokeによる文字潰れの解消）
  const shadowOutline = isNormal
    ? "0 1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 -1px 0 #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 4px rgba(0,0,0,0.95)"
    : "0 1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 -1px 0 #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 6px rgba(244,114,182,0.65), 0 2px 4px rgba(0,0,0,0.95)";

  const titleColor = isNormal ? "#f5f5f4" : "#fef08a";

  return (
    <div
      className={`relative z-20 mx-2 mt-2 px-2.5 py-1.5 sm:py-2 rounded-lg border-2 text-center shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-[3px] transition-all ${
        isNormal
          ? "bg-stone-950/92 border-stone-500/80"
          : "bg-gradient-to-b from-[#180614]/95 via-[#120510]/95 to-[#180614]/95 border-pink-400/90 shadow-[0_0_14px_rgba(244,114,182,0.4)]"
      }`}
    >
      {/* 1段目：冠修飾語 */}
      <div className="flex items-center justify-center pb-0.5 border-b border-pink-500/25">
        <span
          className={`text-[9px] sm:text-[11px] font-black tracking-tight leading-tight line-clamp-1 ${
            isNormal ? "text-stone-300" : "text-pink-200"
          }`}
          style={{
            textShadow: "0 1px 2px #000, 1px 0 0 #000, -1px 0 0 #000, 0 -1px 0 #000",
          }}
        >
          {prefix}
        </span>
      </div>

      {/* 2段目：メイン二つ名（同じ枠の2段目として一体配置） */}
      <div className="pt-1 flex flex-col items-center justify-center">
        {parenMatch ? (
          <div className="flex flex-col items-center justify-center leading-tight">
            <span
              className="font-black text-sm sm:text-base md:text-lg tracking-tight"
              style={{
                color: titleColor,
                textShadow: shadowOutline,
              }}
            >
              {parenMatch[1]}
            </span>
            <span
              className={`font-black text-[10px] sm:text-[11px] tracking-tight leading-none mt-0.5 ${
                isNormal ? "text-stone-300" : "text-pink-200"
              }`}
              style={{
                textShadow: shadowOutline,
              }}
            >
              （{parenMatch[2]}）
            </span>
          </div>
        ) : (
          <span
            className={`font-black leading-tight tracking-tight break-words max-w-full ${
              suffix.length <= 4
                ? "text-base sm:text-xl"
                : suffix.length <= 7
                ? "text-sm sm:text-lg"
                : suffix.length <= 11
                ? "text-xs sm:text-base"
                : "text-[11px] sm:text-sm"
            }`}
            style={{
              color: titleColor,
              textShadow: shadowOutline,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BikkurimanSticker({ result }: BikkurimanStickerProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const archetype = getBikkurimanArchetype(result.suffix, result.isGap, result.seed);
  const meta = ARCHETYPE_META[archetype];
  const palette = getAttributePalette(result.attribute);
  const prismLabel = getPrismTypeLabel(result.rarity);
  const stickerNo = String((result.seed % 999) + 1).padStart(3, "0");
  const isNormal = result.rarity === "N";

  // レア度別の発色差（Nは彩度を抑えたレトロ紙印刷トーン、R以上は鮮やかな発色）
  const imageFilter = isNormal
    ? "saturate(0.45) contrast(0.88) brightness(0.82) sepia(0.22)"
    : result.rarity === "R"
    ? "saturate(1.12) contrast(1.06) brightness(1.03)"
    : "saturate(1.2) contrast(1.08) brightness(1.05)";

  // シール外枠のレア度別スタイル（Nはツヤなしの素朴な紙・石枠、R以上はメタリック＆発光）
  const outerFrameClass =
    result.rarity === "UR"
      ? "ur-rainbow-card shadow-[0_12px_45px_rgba(236,72,153,0.6),0_0_35px_rgba(168,85,247,0.45)]"
      : result.rarity === "SSR"
      ? "ssr-gold-card shadow-[0_12px_40px_rgba(244,114,182,0.5)]"
      : result.rarity === "SR"
      ? "bg-gradient-to-br from-slate-100 via-pink-300 to-purple-400 shadow-[0_10px_35px_rgba(236,72,153,0.4)]"
      : result.rarity === "R"
      ? "bg-gradient-to-br from-purple-200 via-pink-200 to-amber-300 shadow-[0_10px_30px_rgba(192,132,252,0.35)]"
      : "bg-[#c7bfa8] border border-stone-600 shadow-[0_6px_16px_rgba(0,0,0,0.75)]";

  const prismOverlayClass =
    result.rarity === "UR"
      ? "bikkuriman-prism-ur opacity-45 mix-blend-color-dodge"
      : result.rarity === "SSR"
      ? "bikkuriman-prism-ssr opacity-40 mix-blend-overlay"
      : result.rarity === "SR"
      ? "bikkuriman-prism-sr opacity-38 mix-blend-overlay"
      : result.rarity === "R"
      ? "bikkuriman-prism-r opacity-38 mix-blend-overlay"
      : "bikkuriman-prism-n opacity-30 mix-blend-multiply bg-[#d6cbb5]/25";

  return (
    <div className="flex flex-col items-center">
      {/* 正方形のビックリマンシール本体（タップで表面⇔裏面フリップ） */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsFlipped((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped((prev) => !prev);
          }
        }}
        aria-label="ビックリマン風シールを裏返す"
        style={{
          fontFamily:
            '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "BIZ UDPGothic", "Yu Gothic", "Meiryo", system-ui, sans-serif',
        }}
        className={`group relative w-68 h-68 sm:w-80 sm:h-80 rounded-xl p-2 cursor-pointer select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ${outerFrameClass}`}
      >
        {!isFlipped ? (
          /* ================= 表面：本格ビックリマン風イラスト＆角プリズム＆高視認性袋文字タイトル ================= */
          <div className="relative w-full h-full rounded-lg border-[3px] border-stone-950 overflow-hidden flex flex-col justify-between bg-stone-950">
            {/* メインイラスト画像レイヤー */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.imageSrc}
              alt={`${result.fullTitle}のビックリマン風キャラクターイラスト`}
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02]"
              style={{ filter: imageFilter }}
            />

            {/* レアリティ連動のプリズム・紙質感オーバーレイ */}
            <div className={`pointer-events-none absolute inset-0 ${prismOverlayClass}`} />

            {/* 斜めホログラム反射グレア（R以上のキラシールのみ発動、Nはツヤなし） */}
            {!isNormal && (
              <div className="pointer-events-none absolute inset-0 shimmer-effect opacity-90" />
            )}

            {/* 上部：高コントラスト二つ名ネームプレート */}
            {renderStickerTitle(result.prefix, result.suffix, isNormal)}

            {/* 下部：種族バッジ＋対象者ネームプレート＆女子力フッター */}
            <div className="relative z-20 flex flex-col">
              {/* 種族・シールNo・レア度ミニバー */}
              <div className="px-2 pb-1 pt-3 bg-gradient-to-t from-stone-950/95 via-stone-950/70 to-transparent flex items-center justify-between gap-1">
                <span
                  className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded border border-stone-950 shadow-md tracking-tight"
                  style={{
                    backgroundColor: isNormal ? "#44403c" : meta.sealBadgeBg,
                    color: isNormal ? "#e7e5e4" : meta.sealBadgeText,
                  }}
                >
                  {isNormal ? "一般A面シール" : meta.categoryLabel}
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] sm:text-[11px] font-black px-1.5 py-0.5 rounded bg-stone-950/95 text-stone-200 border border-stone-600 font-mono shadow">
                    No.{stickerNo}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded border border-stone-950 shadow-md ${
                      isNormal
                        ? "bg-stone-600 text-stone-200"
                        : result.rarity === "R"
                        ? "bg-purple-600 text-white"
                        : "bg-pink-600 text-yellow-200"
                    }`}
                  >
                    {result.rarity}
                  </span>
                </div>
              </div>

              {/* ネーム＆女子力バー */}
              <div
                className={`bg-stone-950/95 border-t px-2.5 py-1.5 flex items-center justify-between text-xs ${
                  isNormal ? "border-stone-600" : "border-pink-400/80"
                }`}
                style={{ boxShadow: isNormal ? undefined : `0 -4px 16px ${palette.glow}` }}
              >
                <span
                  className={`font-black truncate max-w-[48%] ${
                    isNormal ? "text-stone-300" : "text-pink-200"
                  }`}
                >
                  {result.name}
                </span>
                <span
                  className={`font-mono font-black px-2 py-0.5 rounded text-[11px] shadow ${
                    isNormal
                      ? "bg-stone-800 text-stone-300 border border-stone-600"
                      : "text-yellow-100 bg-gradient-to-r from-pink-600 to-amber-600 border border-pink-300"
                  }`}
                >
                  女子力 {result.combatPowerFormatted}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= 裏面：当時のビックリマン「悪魔VS天使シール 裏書き」風デザイン ================= */
          <div className="relative w-full h-full rounded-lg border-[3px] border-pink-950 bg-[#fef9c3] text-pink-950 p-2.5 flex flex-col justify-between overflow-hidden">
            {/* レトロ印刷の内枠 */}
            <div className="border-2 border-pink-600 rounded h-full p-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-pink-900 pb-1">
                  <span className="text-[10px] font-black bg-pink-600 text-yellow-100 px-1.5 py-0.5 rounded">
                    小悪魔VS天使 A面シール
                  </span>
                  <span className="text-xs font-mono font-black text-pink-900">
                    No.{stickerNo} [{result.rarity}]
                  </span>
                </div>

                {/* ミニキャラアイコン＋二つ名（省略せず全文表示） */}
                <div className="mt-1.5 flex items-center gap-2 bg-pink-950 text-yellow-200 rounded p-1.5">
                  <div className="w-10 h-10 rounded border border-pink-300 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.imageSrc}
                      alt={result.suffix}
                      className="w-full h-full object-cover"
                      style={{ filter: imageFilter }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-[10px] text-pink-200 font-bold leading-tight break-words">
                      {result.prefix}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-yellow-200 leading-tight break-words mt-0.5">
                      {result.suffix}
                    </div>
                  </div>
                </div>

                {/* 必殺スキル解説 */}
                <div className="mt-1.5 bg-yellow-100 border border-pink-900/40 rounded p-1.5 text-[11px] leading-snug text-left">
                  <div className="font-black text-pink-700">
                    ★ 固有スキル：【{result.skill.name}】
                  </div>
                  <p className="text-pink-950 mt-0.5 text-[10px] font-bold">
                    {result.skill.description}
                  </p>
                </div>
              </div>

              {/* 秘密のドレッサーウワサ欄 */}
              <div className="bg-pink-50 border-2 border-dashed border-pink-600 rounded p-1.5 text-[10px] leading-snug text-left">
                <span className="font-black text-pink-700 mr-1">【A面のウワサ】</span>
                <span className="text-stone-900 font-bold">{result.flavorText}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-pink-900 pt-1 border-t border-pink-900/30">
                <span>系統：{meta.archetypeName}</span>
                <span>属性：{result.attribute}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* シール仕様バッジ＆裏面フリップ案内ボタン */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
            isNormal
              ? "bg-stone-900 border border-stone-700 text-stone-400"
              : "bg-pink-950/90 border border-pink-400/40 text-pink-200"
          }`}
        >
          <Sparkles className={`w-3 h-3 ${isNormal ? "text-stone-500" : "text-pink-400"}`} />
          <span>{prismLabel}</span>
        </span>
        <button
          type="button"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="text-xs px-3 py-1 rounded-full bg-[#1a0916] hover:bg-pink-950 border border-pink-400/50 text-pink-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-pink-400" />
          <span>{isFlipped ? "シールの表面（イラスト）に戻す" : "シールを裏返す（裏書きを見る）"}</span>
        </button>
      </div>
    </div>
  );
}
