import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { generateDiagnosis, DiagnosisMode, Rarity } from "@/lib/dictionary";
import { ARCHETYPE_META, getBikkurimanArchetype } from "@/lib/bikkuriman";

export const runtime = "edge";

async function loadGoogleFont(font: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${font}:wght@700;900&text=${encodeURIComponent(
      text.slice(0, 300)
    )}`;
    const css = await (
      await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
        signal: AbortSignal.timeout(4000),
      })
    ).text();

    const resource = css.match(
      /src: url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\) format\('(opentype|truetype)'\)/
    );
    if (resource && resource[1]) {
      const response = await fetch(resource[1], {
        signal: AbortSignal.timeout(4000),
      });
      if (response.status === 200) {
        return await response.arrayBuffer();
      }
    }
  } catch {
    // フォント取得失敗時はフォールバック
  }
  return null;
}

function getRarityStyles(rarity: Rarity) {
  switch (rarity) {
    case "UR":
      return {
        borderColor: "#f472b6",
        outerGlow: "rgba(236, 72, 153, 0.55)",
        badgeBg: "linear-gradient(135deg, #ec4899 0%, #fbbf24 50%, #a855f7 100%)",
        badgeText: "#ffffff",
        accentColor: "#fbcfe8",
        subText: "傾国神話級 UR (0.5%)",
      };
    case "SSR":
      return {
        borderColor: "#fb7185",
        outerGlow: "rgba(244, 63, 94, 0.45)",
        badgeBg: "linear-gradient(135deg, #fda4af 0%, #f59e0b 50%, #db2777 100%)",
        badgeText: "#1c1917",
        accentColor: "#fde68a",
        subText: "国宝美少女級 SSR (4.5%)",
      };
    case "SR":
      return {
        borderColor: "#e879f9",
        outerGlow: "rgba(232, 121, 249, 0.35)",
        badgeBg: "linear-gradient(135deg, #d946ef 0%, #9333ea 100%)",
        badgeText: "#ffffff",
        accentColor: "#f5d0fe",
        subText: "小悪魔ヒロイン級 SR",
      };
    case "R":
      return {
        borderColor: "#c084fc",
        outerGlow: "rgba(192, 132, 252, 0.28)",
        badgeBg: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
        badgeText: "#ffffff",
        accentColor: "#e9d5ff",
        subText: "愛されメイク級 R",
      };
    case "N":
    default:
      return {
        borderColor: "#78716c",
        outerGlow: "rgba(120, 113, 108, 0.2)",
        badgeBg: "linear-gradient(135deg, #57534e 0%, #292524 100%)",
        badgeText: "#e7e5e4",
        accentColor: "#e7e5e4",
        subText: "B面ルーキー級 N",
      };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get("name") || "";
  const modeParam = searchParams.get("mode");
  const dateParam = searchParams.get("date") || undefined;
  const mode: DiagnosisMode = modeParam === "daily" ? "daily" : "standard";

  const isDefault = !rawName.trim();
  const result = generateDiagnosis(isDefault ? "秘密のシンデレラ" : rawName, mode, dateParam);
  const rarityStyle = getRarityStyles(result.rarity);
  const archetypeId = getBikkurimanArchetype(result.suffix, result.attribute, result.isGap);
  const archetypeMeta = ARCHETYPE_META[archetypeId];
  const stickerImgUrl = new URL(archetypeMeta.imageSrc, req.url).toString();

  const textToLoad = Array.from(
    new Set(
      (
        `◆★女装二つ名メーカーB面ステータス鑑定結果称号属性由来：女子力戦闘力${result.name}さんの異名は『${result.fullTitle}』` +
        `推定女子力${result.combatPowerFormatted}固有スキル${result.skill.name}${result.skill.description}` +
        `${result.flavorText}${result.attribute}${rarityStyle.subText}${archetypeMeta.sealTitle}激レア出現！今日の運勢モード通常モード#女装二つ名メーカー#男の娘`
      ).split("")
    )
  ).join("");

  const fontData = await loadGoogleFont("Noto+Serif+JP", textToLoad);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e050c",
          backgroundImage:
            "radial-gradient(circle at 50% 25%, #3b0d2c 0%, #150613 65%, #080307 100%)",
          padding: "34px",
          fontFamily: fontData ? '"Noto Serif JP", serif' : "sans-serif",
          color: "#fce7f3",
          position: "relative",
        }}
      >
        {/* 外枠の小悪魔ゴシック＆シャンパンゴールドフレーム */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: `3px solid ${rarityStyle.borderColor}`,
            borderRadius: "20px",
            padding: "30px 42px",
            backgroundColor: "rgba(18, 7, 16, 0.88)",
            boxShadow: `0 0 55px ${rarityStyle.outerGlow}`,
            position: "relative",
          }}
        >
          {/* ヘッダー行：アプリ名 ＆ レアリティバッジ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              borderBottom: "1px solid rgba(244, 114, 182, 0.35)",
              paddingBottom: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  padding: "6px 18px",
                  backgroundColor: "rgba(236, 72, 153, 0.2)",
                  border: "1px solid #f472b6",
                  borderRadius: "999px",
                  fontSize: "20px",
                  color: "#fbcfe8",
                  fontWeight: 700,
                }}
              >
                ◆ 女装二つ名メーカー ◆
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "24px",
                  color: "#fdf2f8",
                  fontWeight: 700,
                }}
              >
                {isDefault
                  ? "名前を入力して秘められしB面の称号を覚醒せよ"
                  : `${result.name} ちゃんのB面鑑定結果`}
              </div>
              {mode === "daily" && (
                <div
                  style={{
                    display: "flex",
                    padding: "4px 12px",
                    backgroundColor: "rgba(192, 132, 252, 0.25)",
                    border: "1px solid #e879f9",
                    borderRadius: "8px",
                    fontSize: "18px",
                    color: "#f5d0fe",
                  }}
                >
                  今日の盛れ運勢モード
                </div>
              )}
            </div>

            {/* レアリティ＆激レアバッジ */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {(result.rarity === "UR" || result.rarity === "SSR") && (
                <div
                  style={{
                    display: "flex",
                    padding: "6px 16px",
                    background: "linear-gradient(90deg, #db2777, #f59e0b)",
                    borderRadius: "999px",
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#ffffff",
                    border: "1px solid #fde047",
                  }}
                >
                  ★ 激レア美少女出現！
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 24px",
                  background: rarityStyle.badgeBg,
                  color: rarityStyle.badgeText,
                  borderRadius: "10px",
                  fontSize: "28px",
                  fontWeight: 900,
                  border: "2px solid #fbcfe8",
                }}
              >
                RARITY : {result.rarity}
              </div>
            </div>
          </div>

          {/* メイン：ビックリマン風B面シール ＋ 生成された二つ名 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              padding: "14px 26px",
              margin: "6px 0",
              backgroundColor: "rgba(36, 11, 30, 0.78)",
              border: "1px solid rgba(244, 114, 182, 0.4)",
              borderRadius: "16px",
            }}
          >
            {/* 左：ビックリマン風B面守護キャラシール */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "152px",
                height: "152px",
                borderRadius: "12px",
                border:
                  result.rarity === "N"
                    ? "3px solid #a8a29e"
                    : `4px solid ${rarityStyle.borderColor}`,
                background:
                  result.rarity === "UR"
                    ? "linear-gradient(135deg, #ec4899, #fbbf24, #38bdf8, #a855f7)"
                    : result.rarity === "SSR"
                    ? "linear-gradient(135deg, #fda4af, #f59e0b, #fde047)"
                    : result.rarity === "N"
                    ? "#d6d3d1"
                    : "linear-gradient(135deg, #d946ef, #ec4899)",
                padding: "4px",
                boxShadow:
                  result.rarity === "N"
                    ? "0 2px 8px rgba(0, 0, 0, 0.4)"
                    : `0 0 24px ${rarityStyle.outerGlow}`,
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stickerImgUrl}
                alt={archetypeMeta.sealTitle}
                width={136}
                height={136}
                style={{
                  width: "136px",
                  height: "136px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* 右：覚醒せしB面の称号 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "17px",
                  color: "#f9a8d4",
                  marginBottom: "4px",
                  letterSpacing: "0.1em",
                }}
              >
                ― 守護B面シール【{archetypeMeta.sealTitle}】覚醒せし称号 ―
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#fde68a",
                  marginBottom: "2px",
                }}
              >
                {result.prefix}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: result.suffix.length > 12 ? "44px" : "52px",
                  fontWeight: 900,
                  color: rarityStyle.accentColor,
                  textAlign: "center",
                  lineHeight: 1.16,
                  textShadow: "0 4px 24px rgba(236, 72, 153, 0.55)",
                }}
              >
                『{result.suffix}』
              </div>
            </div>
          </div>

          {/* ステータス＆固有スキル2カラム */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              width: "100%",
            }}
          >
            {/* 左：推定女子力＆属性 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "38%",
                backgroundColor: "rgba(28, 8, 23, 0.9)",
                border: "1px solid rgba(244, 114, 182, 0.45)",
                borderRadius: "12px",
                padding: "16px 24px",
              }}
            >
              <div style={{ display: "flex", fontSize: "18px", color: "#f9a8d4" }}>
                推定女子力 (BEAUTY POWER)
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "44px",
                  fontWeight: 900,
                  color: "#fde68a",
                  marginTop: "2px",
                }}
              >
                {result.combatPowerFormatted}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "18px",
                  color: "#fbcfe8",
                  marginTop: "6px",
                }}
              >
                属性：{result.attribute}
              </div>
            </div>

            {/* 右：固有スキル */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "62%",
                backgroundColor: "rgba(28, 8, 23, 0.9)",
                border: "1px solid rgba(244, 114, 182, 0.45)",
                borderRadius: "12px",
                padding: "16px 24px",
              }}
            >
              <div style={{ display: "flex", fontSize: "18px", color: "#f9a8d4" }}>
                固有メイク・自撮りスキル (UNIQUE SKILL)
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "30px",
                  fontWeight: 900,
                  color: "#fde68a",
                  marginTop: "4px",
                }}
              >
                【{result.skill.name}】
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "19px",
                  color: "#fdf2f8",
                  marginTop: "6px",
                }}
              >
                {result.skill.description}
              </div>
            </div>
          </div>

          {/* フッター：由来フレーバーテキスト */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(244, 114, 182, 0.35)",
              paddingTop: "14px",
              fontSize: "18px",
              color: "#fbcfe8",
            }}
          >
            <div style={{ display: "flex" }}>◆ 由来：{result.flavorText}</div>
            <div
              style={{
                display: "flex",
                color: "#f472b6",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              #女装二つ名メーカー
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
      fonts: fontData
        ? [
            {
              name: "Noto Serif JP",
              data: fontData,
              style: "normal",
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}
