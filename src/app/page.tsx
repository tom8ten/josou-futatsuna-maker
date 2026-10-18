import type { Metadata } from "next";
import { headers } from "next/headers";
import { generateDiagnosis, DiagnosisMode } from "@/lib/dictionary";
import DiagnosisClient from "@/components/DiagnosisClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const rawName = typeof resolvedParams.name === "string" ? resolvedParams.name.trim() : "";
  const modeParam = typeof resolvedParams.mode === "string" ? resolvedParams.mode : "standard";
  const dateParam = typeof resolvedParams.date === "string" ? resolvedParams.date : undefined;
  const mode: DiagnosisMode = modeParam === "daily" ? "daily" : "standard";

  const headersList = await headers();
  const rawHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "localhost:3001";
  const safeHost = /^[a-zA-Z0-9.-]+(:\d+)?$/.test(rawHost) ? rawHost : "localhost:3001";
  const proto = safeHost.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || `${proto}://${safeHost}`;

  if (!rawName) {
    const defaultOgUrl = `${baseUrl}/api/og`;
    return {
      title: "女装二つ名メーカー｜B面ステータス＆推定女子力・異名診断",
      description:
        "名前を入力するだけで、あなたの秘められし『女装二つ名（B面称号）』と推定女子力・固有メイクスキルを鑑定！Xで結果カード付きシェアが可能。",
      openGraph: {
        title: "女装二つ名メーカー｜B面ステータス＆推定女子力・異名診断",
        description:
          "名前を入力するだけで、あなたの秘められし『女装二つ名（B面称号）』と推定女子力・固有メイクスキルを鑑定！",
        images: [
          {
            url: defaultOgUrl,
            width: 1200,
            height: 630,
            alt: "女装二つ名メーカー 診断カード",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "女装二つ名メーカー｜B面ステータス＆推定女子力・異名診断",
        description: "名前から決定論的ハッシュでB面の二つ名と女子力ステータスを生成！",
        images: [defaultOgUrl],
      },
    };
  }

  const result = generateDiagnosis(rawName, mode, dateParam);
  const ogParams = new URLSearchParams();
  ogParams.set("name", result.name);
  if (mode === "daily") {
    ogParams.set("mode", "daily");
    if (result.dateStr) ogParams.set("date", result.dateStr);
  }
  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

  const pageTitle = `【${result.name}】のB面異名は『${result.fullTitle}』（レア度：${result.rarity} / 女子力：${result.combatPowerFormatted}）｜女装二つ名メーカー`;
  const pageDesc = `固有スキル：【${result.skill.name}】（${result.skill.description}）― ${result.flavorText}`;

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${result.name}ちゃんの女装二つ名診断結果：${result.fullTitle}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const hasNameParam =
    typeof resolvedParams.name === "string" && resolvedParams.name.trim().length > 0;
  const initialName = hasNameParam ? (resolvedParams.name as string) : "れいな";
  const modeParam = typeof resolvedParams.mode === "string" ? resolvedParams.mode : "standard";
  const initialDate = typeof resolvedParams.date === "string" ? resolvedParams.date : undefined;
  const initialMode: DiagnosisMode = modeParam === "daily" ? "daily" : "standard";

  return (
    <DiagnosisClient
      initialName={initialName}
      initialMode={initialMode}
      initialDate={initialDate}
      autoShowResult={hasNameParam}
    />
  );
}
