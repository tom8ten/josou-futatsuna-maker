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

function getStickerRarityStyles(rarity: Rarity) {
  switch (rarity) {
    case "UR":
      return {
        outerBorder: "#f472b6",
        badgeBg: "#ec4899",
        badgeText: "#ffffff",
      };
    case "SSR":
      return {
        outerBorder: "#fb7185",
        badgeBg: "#e11d48",
        badgeText: "#fef08a",
      };
    case "SR":
      return {
        outerBorder: "#c084fc",
        badgeBg: "#a855f7",
        badgeText: "#ffffff",
      };
    case "R":
      return {
        outerBorder: "#38bdf8",
        badgeBg: "#0284c7",
        badgeText: "#ffffff",
      };
    case "N":
    default:
      return {
        outerBorder: "#78716c",
        badgeBg: "#57534e",
        badgeText: "#f5f5f4",
      };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get("name") || "";
  const modeParam = searchParams.get("mode");
  const dateParam = searchParams.get("date") || undefined;
  const side = searchParams.get("side") === "back" ? "back" : "front";
  const mode: DiagnosisMode = modeParam === "daily" ? "daily" : "standard";

  const isDefault = !rawName.trim();
  const result = generateDiagnosis(isDefault ? "れいな" : rawName, mode, dateParam);
  const rarityStyle = getStickerRarityStyles(result.rarity);
  const archetype = getBikkurimanArchetype(result.suffix, result.isGap, result.seed);
  const archetypeMeta = ARCHETYPE_META[archetype];
  const stickerImgUrl = new URL(archetypeMeta.imageSrc, req.url).toString();

  const stickerNo = String(
    ((Math.abs(result.seed) % 999) + 1)
  ).padStart(3, "0");

  const isNormal = result.rarity === "N";

  // テキスト収集
  const textToLoad = Array.from(
    new Set(
      (
        `小悪魔VS天使A面シールNo.[${result.rarity}]★固有スキル：【${result.skill.name}】` +
        `${result.skill.description}【A面のウワサ】${result.flavorText}` +
        `系統：${archetypeMeta.archetypeName}属性：${result.attribute}` +
        `${result.prefix}${result.suffix}${result.name}女子力${result.combatPowerFormatted}` +
        `${isNormal ? "一般A面" : archetypeMeta.categoryLabel}`
      ).split("")
    )
  ).join("");

  const fontData = await loadGoogleFont("Noto+Serif+JP", textToLoad);

  // 8方向テキストシャドウ
  const textShadowStroke =
    "0 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 -2px 0 #000, 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.95)";

  if (side === "front") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "600px",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0a0908",
            padding: "16px",
            fontFamily: fontData ? '"Noto Serif JP", serif' : "sans-serif",
            position: "relative",
          }}
        >
          {/* 外枠カードフレーム */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "14px",
              border: `6px solid ${rarityStyle.outerBorder}`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#1c1917",
            }}
          >
            {/* メインキャラクターイラスト */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stickerImgUrl}
              alt={result.fullTitle}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* 上部：二つ名ネームプレート（2段構成・中央配置） */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isNormal
                  ? "rgba(10, 10, 10, 0.88)"
                  : "rgba(24, 12, 20, 0.90)",
                borderBottom: `2px solid ${isNormal ? "#57534e" : "#f472b6"}`,
                padding: "8px 12px 10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  color: isNormal ? "#d6d3d1" : "#fbcfe8",
                  textShadow: textShadowStroke,
                  lineHeight: 1.2,
                  marginBottom: "2px",
                }}
              >
                {result.prefix}
              </div>
              <div
                style={{
                  fontSize: result.suffix.length > 10 ? "24px" : "28px",
                  fontWeight: 900,
                  color: isNormal ? "#fafaf9" : "#fef08a",
                  textShadow: textShadowStroke,
                  letterSpacing: "1px",
                  lineHeight: 1.15,
                }}
              >
                {result.suffix}
              </div>
            </div>

            {/* 下部：種族＋名前＋No＋レアリティ＋女子力 */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(10, 10, 10, 0.92)",
                borderTop: `2px solid ${isNormal ? "#57534e" : "#f472b6"}`,
                padding: "8px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor: isNormal ? "#44403c" : archetypeMeta.sealBadgeBg,
                    color: isNormal ? "#e7e5e4" : archetypeMeta.sealBadgeText,
                    fontSize: "12px",
                    fontWeight: 900,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid #000",
                  }}
                >
                  {isNormal ? "一般A面" : archetypeMeta.categoryLabel}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    color: isNormal ? "#d6d3d1" : "#fbcfe8",
                  }}
                >
                  {result.name}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    backgroundColor: "#1c1917",
                    color: "#d6d3d1",
                    padding: "3px 7px",
                    borderRadius: "4px",
                    border: "1px solid #44403c",
                  }}
                >
                  No.{stickerNo}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    backgroundColor: rarityStyle.badgeBg,
                    color: rarityStyle.badgeText,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid #000",
                  }}
                >
                  {result.rarity}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    backgroundColor: "#db2777",
                    color: "#fef08a",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid #f472b6",
                  }}
                >
                  女子力 {result.combatPowerFormatted}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 600,
      }
    );
  }

  // 裏面 (side=back)
  return new ImageResponse(
    (
      <div
        style={{
          width: "600px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fef9c3",
          padding: "16px",
          fontFamily: fontData ? '"Noto Serif JP", serif' : "sans-serif",
          color: "#831843",
        }}
      >
        {/* 外枠＆内枠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "5px solid #831843",
            borderRadius: "14px",
            padding: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              border: "3px solid #db2777",
              borderRadius: "8px",
              padding: "12px 14px",
              overflow: "hidden",
            }}
          >
            {/* 上部セクション */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* ヘッダーバー */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "2px solid rgba(131, 24, 67, 0.3)",
                  paddingBottom: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    backgroundColor: "#db2777",
                    color: "#fef08a",
                    padding: "3px 10px",
                    borderRadius: "4px",
                  }}
                >
                  小悪魔VS天使 A面シール
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    color: "#831843",
                  }}
                >
                  No.{stickerNo} [{result.rarity}]
                </div>
              </div>

              {/* キャラアイコン＋二つ名プレート */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#500724",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  gap: "12px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stickerImgUrl}
                  alt={result.suffix}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "6px",
                    border: "2px solid #f472b6",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#fbcfe8",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {result.prefix}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "#fef08a",
                      fontWeight: 900,
                      lineHeight: 1.2,
                    }}
                  >
                    {result.suffix}
                  </div>
                </div>
              </div>

              {/* 固有スキル解説 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fef08a",
                  border: "1.5px solid rgba(131, 24, 67, 0.4)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    color: "#be185d",
                    marginBottom: "3px",
                  }}
                >
                  ★ 固有スキル：【{result.skill.name}】
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#831843",
                    lineHeight: 1.35,
                    fontWeight: 500,
                  }}
                >
                  {result.skill.description}
                </div>
              </div>

              {/* ウワサ欄 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fdf2f8",
                  border: "1.5px dashed #db2777",
                  borderRadius: "6px",
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    color: "#be185d",
                    marginBottom: "3px",
                  }}
                >
                  【A面のウワサ】
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#1c1917",
                    lineHeight: 1.35,
                    fontWeight: 700,
                  }}
                >
                  {result.flavorText}
                </div>
              </div>
            </div>

            {/* フッター */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "13px",
                fontWeight: 900,
                color: "#831843",
                borderTop: "1.5px solid rgba(131, 24, 67, 0.25)",
                paddingTop: "6px",
              }}
            >
              <div>系統：{archetypeMeta.archetypeName}</div>
              <div>属性：{result.attribute}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 600,
    }
  );
}
