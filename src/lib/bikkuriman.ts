import { Rarity } from "./dictionary";

export type BikkurimanArchetype =
  | "paladin"
  | "demon_lord"
  | "archmage"
  | "reaper"
  | "dragoon"
  | "vampire"
  | "alchemist"
  | "observer"
  | "teiji_dash"
  | "futon_sage"
  | "cat_servant"
  | "hangaku_hunter"
  | "caffeine_addict"
  | "digital_cursed"
  | "ouch_sinner"
  | "broke_noble";

export interface ArchetypeMeta {
  id: BikkurimanArchetype;
  categoryLabel: string; // 傾国ヘッド / 小悪魔ヘッド / 天使界隈 / あるある珍聖 等
  archetypeName: string; // 系統名
  imageSrc: string; // ビックリマン風本格イラスト画像パス
  sealBadgeBg: string;
  sealBadgeText: string;
  titleColor: string;
  titleStroke: string;
}

/**
 * 女装二つ名メーカーの後半名詞（COOL_SUFFIXES 48種 + GAP_SUFFIXES 45種）から
 * 16種類のビックリマン風キャラ系統への決定論的マッピング
 */
export function getBikkurimanArchetype(
  suffix: string,
  isGap: boolean,
  seed: number
): BikkurimanArchetype {
  if (!isGap) {
    if (
      suffix.includes("聖騎士") ||
      suffix.includes("聖女") ||
      suffix.includes("清楚") ||
      suffix.includes("エンジェル") ||
      suffix.includes("天使") ||
      suffix.includes("妖精") ||
      suffix.includes("シンデレラ")
    ) {
      return "paladin";
    }
    if (
      suffix.includes("小悪魔") ||
      suffix.includes("地雷系") ||
      suffix.includes("ゴシック") ||
      suffix.includes("ファム・ファタール") ||
      suffix.includes("魔性") ||
      suffix.includes("堕天使") ||
      suffix.includes("魔女王") ||
      suffix.includes("女帝")
    ) {
      return "vampire";
    }
    if (
      suffix.includes("魔術師") ||
      suffix.includes("大賢者") ||
      suffix.includes("魔導師") ||
      suffix.includes("マイスター") ||
      suffix.includes("調教師") ||
      suffix.includes("カリスマ")
    ) {
      return "archmage";
    }
    if (
      suffix.includes("覇王") ||
      suffix.includes("破壊神") ||
      suffix.includes("支配者") ||
      suffix.includes("絶対王者") ||
      suffix.includes("ランウェイ王") ||
      suffix.includes("アイドル王")
    ) {
      return "demon_lord";
    }
    if (
      suffix.includes("狙撃手") ||
      suffix.includes("幻影騎士") ||
      suffix.includes("舞踏姫") ||
      suffix.includes("ヒロイン") ||
      suffix.includes("バタフライ")
    ) {
      return "dragoon";
    }
    if (
      suffix.includes("錬金術師") ||
      suffix.includes("永久機関") ||
      suffix.includes("貴公子") ||
      suffix.includes("コスメ")
    ) {
      return "alchemist";
    }
    if (
      suffix.includes("深夜") ||
      suffix.includes("シークレット") ||
      suffix.includes("秘密")
    ) {
      return "reaper";
    }
    return "observer";
  }

  // 女装さんリアルあるある・ギャップ系 (15%枠)
  if (
    suffix.includes("宅配便") ||
    suffix.includes("足音") ||
    suffix.includes("RTA走者") ||
    suffix.includes("周回ランナー") ||
    suffix.includes("職場") ||
    suffix.includes("お出かけ30分")
  ) {
    return "teiji_dash";
  }
  if (
    suffix.includes("寝落ち") ||
    suffix.includes("洗濯") ||
    suffix.includes("賢者タイム") ||
    suffix.includes("トイレ")
  ) {
    return "futon_sage";
  }
  if (
    suffix.includes("自撮り") ||
    suffix.includes("角度45度") ||
    suffix.includes("トリミング") ||
    suffix.includes("タイマー3秒") ||
    suffix.includes("萌え袖")
  ) {
    return "digital_cursed";
  }
  if (
    suffix.includes("コンシーラー") ||
    suffix.includes("シェーディング") ||
    suffix.includes("クレンジング") ||
    suffix.includes("前髪セット") ||
    suffix.includes("つけま") ||
    suffix.includes("カラコン") ||
    suffix.includes("リップ") ||
    suffix.includes("チョーカー")
  ) {
    return "caffeine_addict";
  }
  if (
    suffix.includes("ピンヒール") ||
    suffix.includes("肩幅") ||
    suffix.includes("声帯") ||
    suffix.includes("くしゃみ") ||
    suffix.includes("頭痛") ||
    suffix.includes("生足") ||
    suffix.includes("ビューラー") ||
    suffix.includes("呼吸困難") ||
    suffix.includes("肩こり") ||
    suffix.includes("26.5cm") ||
    suffix.includes("ホック")
  ) {
    return "ouch_sinner";
  }
  if (
    suffix.includes("賭博師") ||
    suffix.includes("収納") ||
    suffix.includes("増殖") ||
    suffix.includes("金欠")
  ) {
    return "broke_noble";
  }

  const gapFallbacks: BikkurimanArchetype[] = [
    "teiji_dash",
    "futon_sage",
    "caffeine_addict",
    "digital_cursed",
    "ouch_sinner",
  ];
  return gapFallbacks[seed % gapFallbacks.length];
}

export const ARCHETYPE_META: Record<BikkurimanArchetype, ArchetypeMeta> = {
  paladin: {
    id: "paladin",
    categoryLabel: "天使界隈ヘッド",
    archetypeName: "清楚・聖女ヒロイン系",
    imageSrc: "/stickers/paladin.jpg",
    sealBadgeBg: "#db2777",
    sealBadgeText: "#fef08a",
    titleColor: "#fde047",
    titleStroke: "#be185d",
  },
  demon_lord: {
    id: "demon_lord",
    categoryLabel: "傾国覇王ヘッド",
    archetypeName: "絶対領域・美脚覇王系",
    imageSrc: "/stickers/demon_lord.jpg",
    sealBadgeBg: "#701a75",
    sealBadgeText: "#f5d0fe",
    titleColor: "#fde047",
    titleStroke: "#701a75",
  },
  archmage: {
    id: "archmage",
    categoryLabel: "美神ヘッド",
    archetypeName: "アイライン・盛れ魔術師系",
    imageSrc: "/stickers/archmage.jpg",
    sealBadgeBg: "#6d28d9",
    sealBadgeText: "#ddd6fe",
    titleColor: "#fef08a",
    titleStroke: "#5b21b6",
  },
  reaper: {
    id: "reaper",
    categoryLabel: "深夜小悪魔",
    archetypeName: "夜間飛行・シークレット系",
    imageSrc: "/stickers/reaper.jpg",
    sealBadgeBg: "#3b0764",
    sealBadgeText: "#f0abfc",
    titleColor: "#f5d0fe",
    titleStroke: "#3b0764",
  },
  dragoon: {
    id: "dragoon",
    categoryLabel: "閃光ヒロイン",
    archetypeName: "ウインク狙撃・変身姫系",
    imageSrc: "/stickers/dragoon.jpg",
    sealBadgeBg: "#be123c",
    sealBadgeText: "#fecdd3",
    titleColor: "#fde047",
    titleStroke: "#881337",
  },
  vampire: {
    id: "vampire",
    categoryLabel: "小悪魔ヘッド",
    archetypeName: "地雷・ゴシックドール系",
    imageSrc: "/stickers/vampire.jpg",
    sealBadgeBg: "#831843",
    sealBadgeText: "#fbcfe8",
    titleColor: "#fbcfe8",
    titleStroke: "#831843",
  },
  alchemist: {
    id: "alchemist",
    categoryLabel: "コスメお守り",
    archetypeName: "涙袋・デパコス錬金術系",
    imageSrc: "/stickers/alchemist.jpg",
    sealBadgeBg: "#be185d",
    sealBadgeText: "#fce7f3",
    titleColor: "#fde047",
    titleStroke: "#9d174d",
  },
  observer: {
    id: "observer",
    categoryLabel: "概念超越神",
    archetypeName: "国宝級・美意識最高峰系",
    imageSrc: "/stickers/observer.jpg",
    sealBadgeBg: "#86198f",
    sealBadgeText: "#f5d0fe",
    titleColor: "#fef08a",
    titleStroke: "#701a75",
  },
  teiji_dash: {
    id: "teiji_dash",
    categoryLabel: "A面ステルス珍聖",
    archetypeName: "玄関応対・高速変身系",
    imageSrc: "/stickers/teiji_dash.jpg",
    sealBadgeBg: "#0284c7",
    sealBadgeText: "#fef08a",
    titleColor: "#fef08a",
    titleStroke: "#0369a1",
  },
  futon_sage: {
    id: "futon_sage",
    categoryLabel: "寝落ちお守り",
    archetypeName: "メイクオフ・賢者タイム系",
    imageSrc: "/stickers/futon_sage.jpg",
    sealBadgeBg: "#4f46e5",
    sealBadgeText: "#e0e7ff",
    titleColor: "#fde047",
    titleStroke: "#3730a3",
  },
  cat_servant: {
    id: "cat_servant",
    categoryLabel: "愛されお守り",
    archetypeName: "あざとポーズ・尊い系",
    imageSrc: "/stickers/cat_servant.jpg",
    sealBadgeBg: "#db2777",
    sealBadgeText: "#fce7f3",
    titleColor: "#fef08a",
    titleStroke: "#be185d",
  },
  hangaku_hunter: {
    id: "hangaku_hunter",
    categoryLabel: "ドンキ巡礼珍聖",
    archetypeName: "プチプラ発掘・周回系",
    imageSrc: "/stickers/hangaku_hunter.jpg",
    sealBadgeBg: "#dc2626",
    sealBadgeText: "#fef08a",
    titleColor: "#fde047",
    titleStroke: "#b91c1c",
  },
  caffeine_addict: {
    id: "caffeine_addict",
    categoryLabel: "コンシーラーお守り",
    archetypeName: "フルメイク3時間・隠蔽職人系",
    imageSrc: "/stickers/caffeine_addict.jpg",
    sealBadgeBg: "#d97706",
    sealBadgeText: "#fffbeb",
    titleColor: "#fef08a",
    titleStroke: "#92400e",
  },
  digital_cursed: {
    id: "digital_cursed",
    categoryLabel: "自撮り300枚悪魔",
    archetypeName: "斜め45度・奇跡の1枚厳選系",
    imageSrc: "/stickers/digital_cursed.jpg",
    sealBadgeBg: "#9333ea",
    sealBadgeText: "#f3e8ff",
    titleColor: "#f5d0fe",
    titleStroke: "#581c87",
  },
  ouch_sinner: {
    id: "ouch_sinner",
    categoryLabel: "A面あるある受難",
    archetypeName: "ピンヒール崩壊・冬場生足系",
    imageSrc: "/stickers/ouch_sinner.jpg",
    sealBadgeBg: "#9d174d",
    sealBadgeText: "#fbcfe8",
    titleColor: "#fde047",
    titleStroke: "#831843",
  },
  broke_noble: {
    id: "broke_noble",
    categoryLabel: "コスメ散財貴族",
    archetypeName: "新作コスメ金欠・衣装増殖系",
    imageSrc: "/stickers/broke_noble.jpg",
    sealBadgeBg: "#713f12",
    sealBadgeText: "#fef08a",
    titleColor: "#fde047",
    titleStroke: "#713f12",
  },
};

/**
 * スタイル属性に応じたオーラカラーパレット
 */
export function getAttributePalette(attribute: string): {
  primary: string;
  secondary: string;
  glow: string;
} {
  if (attribute.includes("小悪魔") || attribute.includes("地雷")) {
    return { primary: "#ec4899", secondary: "#a855f7", glow: "rgba(236,72,153,0.6)" };
  }
  if (attribute.includes("清楚") || attribute.includes("制服")) {
    return { primary: "#38bdf8", secondary: "#f472b6", glow: "rgba(56,189,248,0.6)" };
  }
  if (attribute.includes("アイドル") || attribute.includes("あざと")) {
    return { primary: "#f43f5e", secondary: "#fde047", glow: "rgba(244,63,94,0.65)" };
  }
  if (attribute.includes("クール") || attribute.includes("モード")) {
    return { primary: "#8b5cf6", secondary: "#06b6d4", glow: "rgba(139,92,246,0.6)" };
  }
  return { primary: "#db2777", secondary: "#f59e0b", glow: "rgba(219,39,119,0.6)" };
}

/**
 * レアリティに応じたプリズム種別ラベル
 */
export function getPrismTypeLabel(rarity: Rarity): string {
  switch (rarity) {
    case "UR":
      return "虹色角プリズム（傾国神話ヘッド仕様）";
    case "SSR":
      return "黄金×ローズ角プリズム（国宝ヘッド仕様）";
    case "SR":
      return "銀アルミ角プリズム（キラ仕様）";
    case "R":
      return "サンバースト扇プリズム（キラ仕様）";
    case "N":
    default:
      return "ノーマル紙シール仕様（非キラ）";
  }
}
