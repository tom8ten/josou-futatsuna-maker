export type Rarity = "UR" | "SSR" | "SR" | "R" | "N";

export type DiagnosisMode = "standard" | "daily";

export interface DiagnosisResult {
  name: string;
  mode: DiagnosisMode;
  dateStr?: string;
  seed: number;
  prefix: string;
  suffix: string;
  fullTitle: string;
  isGap: boolean;
  rarity: Rarity;
  combatPower: number;
  combatPowerFormatted: string;
  skill: {
    name: string;
    description: string;
  };
  flavorText: string;
  stats: {
    make: number; // メイク技術
    photo: number; // 自撮り盛れ度
    devil: number; // 小悪魔オーラ
    style: number; // 美脚・シルエット
    gap: number; // 変身ギャップ
  };
  attribute: string;
}

/**
 * 前半の修飾語（王道小悪魔・傾国の美貌ワード 48パターン）
 */
export const PREFIXES: string[] = [
  "性別という概念を超越せし",
  "全人類の視線を奪う",
  "月光に舞う小悪魔の",
  "奇跡の骨格を宿せし",
  "深夜のタイムラインを狂わせる",
  "禁忌の美貌を覚醒せし",
  "天使のウィッグを纏いし",
  "絶対領域に神を宿す",
  "百貨店コスメを統べる",
  "加工なしで世界を救う",
  "清楚の皮を被りし",
  "リングライトの光を束ねし",
  "万物の理をバグらせる",
  "令和に舞い降りし傾国の",
  "薔薇の吐息を纏う",
  "異次元のスタイルを誇る",
  "黒レースの契約を結びし",
  "鏡の国の王座に君臨する",
  "あざと可愛さの極致に達せし",
  "視線だけで異性を惑わす",
  "秘密のクローゼットから現れし",
  "休日の夜だけ覚醒する",
  "シルクの肌と魔性を秘めし",
  "黄金比の涙袋を持つ",
  "硝子のハイヒールを履きこなす",
  "次元を超えて愛される",
  "甘き香水の結界を張る",
  "漆黒のゴシックドレスを纏う",
  "純白のフリルに愛されし",
  "極上のウインクで撃ち抜く",
  "週末の夜を支配する",
  "美神（ヴィーナス）の祝福を受けし",
  "背徳のルージュを引く",
  "儚げな瞳で全てを虜にする",
  "地雷原で優雅に踊る",
  "天使と悪魔の二面性を持つ",
  "圧倒的ヒロイン力を放つ",
  "神域のアイラインを描く",
  "星空のラメを瞼に宿す",
  "シルエットだけで優勝する",
  "禁断の扉を開きし魅惑の",
  "全フォロワーの情緒を破壊する",
  "甘美なる幻想を紡ぐ",
  "完璧なポージングを極めし",
  "夜の街に咲く一輪の",
  "運命のコンパクトを開きし",
  "可憐なる微笑みの裏に潜む",
  "神々が性別を間違えた",
];

/**
 * 後半の名詞：85%で選出される「王道・傾国の美少女・憧れワード」（48パターン）
 */
export const COOL_SUFFIXES: string[] = [
  "傾国の美少女",
  "国宝級男の娘",
  "小悪魔プリンセス",
  "絶対領域の支配者",
  "奇跡の自撮りマイスター",
  "幻影の美神（ヴィーナス）",
  "深夜のファム・ファタール",
  "地雷系ダークヒロイン",
  "量産型エンジェル",
  "純白の清楚系お姉さん",
  "魅惑のゴシックドール",
  "アイラインの魔術師",
  "涙袋の錬金術師",
  "美脚の覇王",
  "概念破壊の美少女",
  "タイムラインの女神",
  "異次元スタイルの聖女",
  "秘密のシンデレラ",
  "A面覚醒のカリスマ",
  "小顔効果の超越者",
  "甘え上手の魔性姫",
  "ハイブランドの守護神",
  "黒ストッキングの女帝",
  "ニーハイソックスの聖騎士",
  "天使界隈の最高傑作",
  "チャイナドレスの破壊神",
  "メイド服の絶対王者",
  "制服コーデの永久機関",
  "コスメカウンターの貴公子",
  "美肌フィルター不要の奇跡",
  "ウインク一発の狙撃手（スナイパー）",
  "骨格ウェーブの幻影騎士",
  "夜間飛行のバタフライ",
  "薔薇園のシークレットクイーン",
  "可憐なる変身ヒロイン",
  "艶髪ウィッグの調教師",
  "ピンヒールの舞踏姫",
  "甘辛ミックスの支配者",
  "視線独占のランウェイ王",
  "魅惑のスリット魔導師",
  "透明感1000%の妖精",
  "あざとポーズの大賢者",
  "全肯定される愛され姫",
  "サブカル界隈の堕天使",
  "推され確定のアイドル王",
  "美意識の最高峰",
  "契約せし夜の魔女王",
  "鏡界のアルティメット美少女",
];

/**
 * 後半の名詞：15%で選出される「女装さんリアルあるある・哀愁シュールワード」（45パターン）
 */
export const GAP_SUFFIXES: string[] = [
  "青髭コンシーラー職人",
  "ウィッグネット行方不明者",
  "肩幅ガンダムの末裔",
  "声帯だけダンディズム",
  "メイク落とし忘れ寝落ち勢",
  "つけまノリが一生乾かない者",
  "ロングウィッグ絡まり大罪人",
  "通販レディースLサイズ賭博師",
  "ストッキング伝線RTA走者",
  "ピンヒールで足裏崩壊せし者",
  "自撮り300枚から奇跡の1枚を選ぶ者",
  "オレンジコンシーラー厚塗り装甲兵",
  "地毛がもみあげからハミ出し者",
  "宅配便をA面（女装中）で受け取りし勇者",
  "コスメ収納が限界突破せし者",
  "シェーディングでエラを削りし彫刻家",
  "鏡の角度45度に全てを賭ける者",
  "くしゃみした瞬間だけ野太い声の者",
  "ブラのホックが背中で留められない者",
  "ウィッグ締め付け頭痛との闘士",
  "クレンジングオイル大量消費魔神",
  "家族の足音に超聴覚を発動せし者",
  "女装服の洗濯干し場所に悩む賢者",
  "カラコンが裏返って絶望せし者",
  "リップが前歯についちゃった姫",
  "冬場の生足ロケで凍えし氷結勇者",
  "普段との落差で風邪ひかせる者",
  "ビューラーで瞼を挟みし殉教者",
  "タイツの前後を間違えて履きし者",
  "つけまつ毛が片方だけ離陸せし者",
  "メイク時間3時間・お出かけ30分の民",
  "喉仏をチョーカーで完全封印せし者",
  "手のゴツさを萌え袖で隠蔽するプロ",
  "ドンキのコスメコーナー周回ランナー",
  "足のサイズ26.5cmの可愛い靴難民",
  "自撮りタイマー3秒でポーズ間に合わない者",
  "ウィッグスタンドが部屋で増殖せし者",
  "ラメが翌日の職場まで残っていた者",
  "ウエストニッパーで呼吸困難の騎士",
  "前髪セットに45分溶かした錬金術師",
  "フルメイク後にトイレ行きたくなる法則の民",
  "背景の生活感を必死にトリミングする者",
  "新作コスメで毎月金欠の貴族",
  "シリコンバストの重みで肩こり限界の者",
  "すっぴんに戻った瞬間の賢者タイム体現者",
];

/**
 * 固有スキル一覧（45パターン）
 */
export const SKILLS: { name: string; description: string }[] = [
  { name: "オレンジコンシーラー完全隠蔽", description: "いかなる青髭も跡形もなく消し去る光学迷彩メイク術" },
  { name: "奇跡の角度（斜め45度）固定", description: "カメラを向けられた瞬間、最も小顔に映る角度へ自動追尾する" },
  { name: "絶対領域展開・ニーハイ", description: "スカートとニーハイの黄金比により周囲の視線を強制ロックする" },
  { name: "声帯ミュート＆微笑み返し", description: "話しかけられても可愛い会釈と微笑みだけで会話を完全成立させる" },
  { name: "神速のA面変身（ドレスアップ）", description: "帰宅後わずか15分で普段着から完璧な美少女へとクラスチェンジする" },
  { name: "光飛ばしリングライト召喚", description: "白飛びギリギリの聖なる光で毛穴と影を異空間へ消滅させる" },
  { name: "シェーディング輪郭削り", description: "フェイスラインに絶妙な影を落とし、骨格を30%縮小表示させる" },
  { name: "自撮り300枚厳選の魔眼", description: "連写した膨大な写真から『最高に盛れた1枚』を0.2秒で特定する" },
  { name: "萌え袖による骨格隠蔽", description: "長めの袖で手首から先を隠し、華奢なシルエットを完全偽装する" },
  { name: "喉仏封印の黒チョーカー", description: "リボンやチョーカーを装備することで首元の防御力と可愛さを倍増する" },
  { name: "涙袋ぷっくり錬金術", description: "ラメと影ペンシルを駆使し、何もない目元に慈愛の涙袋を創造する" },
  { name: "ウィッグサラサラ復活の儀", description: "柔軟剤とシリコンスプレーで絡まりきった毛先を新品同様に蘇生する" },
  { name: "地毛完全格納ネット術", description: "どんな剛毛も1ミリもはみ出さずにウィッグネットへ封印する高等技術" },
  { name: "足音察知ステルス解除", description: "家族や配達員の気配を半径20m先で察知し、即座に証拠を隠滅する" },
  { name: "ピンヒール無重力歩行", description: "10cmヒールでも足裏の痛みを精神力で無効化し優雅に闊歩する" },
  { name: "アイライン左右対称の一閃", description: "手ブレゼロの極限集中により、0.1mmの狂いもない跳ね上げラインを描く" },
  { name: "背景ボカシ空間歪曲", description: "部屋の散らかり具合を察知し、ポートレートモードで美しく抹消する" },
  { name: "通販サイズ目利き千里眼", description: "肩幅と着丈の数値だけで自分が着られるレディース服を99%見抜く" },
  { name: "A面ギャップ衝撃波", description: "普段の姿からは想像もつかない美少女化で知人の脳をバグらせる" },
  { name: "カラコン一発装着の奇跡", description: "まばたき厳禁の極限状態でも1発で瞳にレンズをフィットさせる" },
  { name: "小悪魔ウインク被弾確定", description: "タイムラインで目が合ったフォロワーのいいねボタンを強制連打させる" },
  { name: "前髪鉄壁キープ結界", description: "強風や湿気の中でもケープの魔力で前髪のアーチを1ミリも崩さない" },
  { name: "口角キュッと上昇パッシブ", description: "マスクやスマホで口元を隠しつつ、目元だけで最高の笑顔を演出する" },
  { name: "深夜2時のファッションショー", description: "寝るはずだった時間に突如クローゼットの服を全部試着し始める" },
  { name: "クレンジング即時浄化", description: "どれほど濃いフルメイクも5分でオフし、翌朝の肌荒れを完全回避する" },
  { name: "ストッキング伝線バリア", description: "爪や乾燥による不意の伝線を運命力でギリギリ回避する守護スキル" },
  { name: "デパコス召喚の散財魔法", description: "『これは必要経費』と唱えることで財布のダメージを精神的に無効化する" },
  { name: "あざと上目遣いクリティカル", description: "カメラを少し上から構えることで保護欲を1000%掻き立てる" },
  { name: "ウィッグ位置ミリ単位調整", description: "生え際の位置を数ミリ後ろに下げるだけでおでこの違和感を完全に消す" },
  { name: "ラメ飛び完全防止フィールド", description: "翌日の職場や学校にキラキラのラメを持ち越さない徹底浄化" },
  { name: "ウエストくびれ強制生成", description: "コルセットとポージングの相乗効果で砂時計ラインを出現させる" },
  { name: "つけまノリ速乾ブレス", description: "絶妙なタイミングで見極め、目頭から目尻まで完璧に密着させる" },
  { name: "美脚クロス立ちの極意", description: "脚をクロスしてつま先を伸ばすことで脚長効果を1.3倍に増幅する" },
  { name: "オーバーリップ錬成", description: "唇の山を1ミリオーバーに描き、人中短縮とぷるぷる感を同時に得る" },
  { name: "推しのコーデ完全再現", description: "憧れのアニメキャラやモデルのコーデを驚異の再現度で着こなす" },
  { name: "褒め言葉無限吸収エンジン", description: "『可愛い！』のリプライを受け取るほど次回のメイク精度が上昇する" },
  { name: "鏡前タイムワープ", description: "『ちょっとメイク練習しよう』と鏡の前に座ると3時間が経過している" },
  { name: "ノーズシャドウ立体彫塑", description: "鼻筋に光と影の魔法を宿し、横顔まで完璧なEラインを構築する" },
  { name: "自撮り棒・三脚迷彩設置", description: "外出先のロケーションでも周囲に気づかれず1.5秒で撮影を完了する" },
  { name: "インナーカラー魅惑チラ見せ", description: "耳に髪をかけた瞬間に覗く差し色でセンスの良さを決定づける" },
  { name: "寒さ無効化の生足根性", description: "真冬の撮影でもカメラの前では一切鳥肌を見せず春の微笑みを保つ" },
  { name: "コスメ収納テトリス", description: "増え続けるウィッグと衣装を奇跡のパズル力でクローゼットに収める" },
  { name: "黄金のフィルター調合", description: "色温度と彩度を1%単位で調整し、透明感あふれる世界観を完成させる" },
  { name: "ダブルピース小顔シールド", description: "頬の横にピースを添えることで可愛さと輪郭カバーを同時に達成する" },
  { name: "不死鳥のモチベ再燃", description: "『もう女装やめようかな…』と思っても新作コスメを見ると即復活する" },
];

/**
 * 二つ名の由来（1行フレーバーテキスト 45パターン）
 */
export const FLAVOR_TEXTS: string[] = [
  "普段の姿とA面（女装時）のギャップがあまりに激しく、同一人物だと誰も信じない伝説の存在。",
  "タイムラインに自撮りを投下するたび、男女問わず無数のハートを狂わせてきた罪深き美少女。",
  "『ちょっと試着するだけ』のつもりが、気づけばフルメイクで2時間撮影会をしている情熱の持ち主。",
  "ウィッグを被りアイラインを引いた瞬間、別人格の可憐なヒロインが降臨する憑依型タイプ。",
  "数々のコスメを試行錯誤し、独自の『最強に盛れる黄金レシピ』を確立した努力の天才。",
  "鏡の中の自分に一番癒やされている自己完結型の美意識マイスター。なお翌朝は眠い。",
  "可愛い服を見つけると『これA面で着たら絶対似合う…』と脳内コーデが止まらないロマンチスト。",
  "完璧な美少女シルエットを誇るが、くしゃみをした瞬間だけ野生の低音ボイスが漏れる愛嬌の持ち主。",
  "クローゼットの半分以上がA面の衣装とウィッグに占領されつつある、幸せな秘密主義者。",
  "『女の子より女の子らしい』と称賛される一方、メイク落としの瞬間だけは虚無の表情になる。",
  "光の角度と前髪の1ミリに魂を込めるプロフェッショナル。カメラロールは自撮りで埋まっている。",
  "普段はクールに振る舞っているが、可愛いフリルやリボンを見るとテンションが限界突破する。",
  "コンシーラーとシェーディングの魔術により、骨格の概念すら書き換えてしまう錬金術師。",
  "ヒールを履くと身長が180cm近くなるが、その圧倒的モデル体型がかえって神々しいと評判。",
  "夜な夜なメイク技術を磨き続け、半年前の自分の写真を見ると成長ぶりに驚くストイック派。",
  "褒められると画面の前でニヤニヤが止まらない、素直で愛され体質の小悪魔系。",
  "ウィッグのケアからネイルの先まで一切妥協しないが、部屋の片付けだけは後回しにしがち。",
  "地雷系から清楚系まで着こなすカメレオン俳優ならぬカメレオン男の娘。",
  "『今日こそ早く寝る』と言いながら深夜1時に新しいメイク法を試し始める探究者。",
  "外出イベントの日は前日から遠足前の小学生のようにソワソワしてしまう純粋な魂の持ち主。",
  "美脚を活かした絶対領域の破壊力は、見た者の語彙力を『かわいい』の4文字に退化させる。",
  "ドン・キホーテと薬局のコスメコーナーを聖地と崇め、新作チェックを欠かさないトレンドハンター。",
  "マスクを外しても違和感ゼロのベースメイクを極めし者。下地選びには並々ならぬこだわりがある。",
  "自撮りの構図とポージングの引き出しが多く、指先の角度ひとつで世界観を作れる表現者。",
  "普段のストレスをA面への変身ですべて浄化する、現代社会を美しく生き抜くサバイバー。",
  "友達やフォロワーからの『似合ってる！』の一言が最大のエネルギー源になるタイプ。",
  "通販で届いた服のサイズがピッタリだった時の喜びは、ガチャでSSRを引いた時を超える。",
  "つけまつ毛とカラコンを装着した瞬間、瞳の中に星宿るような輝きが宿る。",
  "まだ見ぬ『史上最高に盛れた自分』を追い求め、今日もリングライトの前に立つ求道者。",
  "どんなに疲れていてもメイクを落とすまでが女装だと心に決めている美肌意識の鑑。",
  "ふとした仕草や首のかしげ方に、天性のあざと可愛さがにじみ出ている天性のヒロイン。",
  "黒ストッキングのデニール数に強いこだわりを持ち、季節を問わず美脚道を貫く求道者。",
  "新しいウィッグが届いた日は、開封して被るまでのスピードが音速を超える。",
  "普段着で街を歩いている時も、ショーウィンドウに映るレディース服をついチェックしてしまう。",
  "清楚なお姉さんを目指してメイクしたのに、なぜか小悪魔的な色気が出てしまう魅惑の体質。",
  "撮影後のカメラロールを見返し、『この角度は天才かも…』と静かにガッツポーズする瞬間が好き。",
  "コスメポーチの中身は戦場を生き抜く一級品の精鋭アイテムばかりが揃っている。",
  "SNSの通知が鳴るたびにちょっとドキドキしながら反応を見に行く可愛らしい一面を持つ。",
  "骨格のハンデを逆手に取り、スラッとした高身長美女オーラへと昇華させた逆転の覇者。",
  "いつか挑戦してみたい憧れの衣装をカートに入れたまま、タイミングを窺っている策士。",
  "メイクが完璧に決まった日は、しばらく鏡の前から離れられなくなるナルシシズムの貴公子。",
  "A面の時は言葉遣いや指先の動きまで自然と丁寧になる、生粋のロールプレイヤー。",
  "周囲をハッとさせる華やかさと、どこか放っておけない儚さを併せ持つ稀有な存在。",
  "長時間のピンヒール歩行で鍛えられたふくらはぎは、もはやアスリート並みの持久力を誇る。",
  "その美貌はまさに百花繚乱。今日もタイムラインに一輪の華を咲かせる。",
];

/**
 * スタイル属性一覧
 */
export const ATTRIBUTES: string[] = [
  "小悪魔ゴシック",
  "地雷・量産型エンジェル",
  "清楚系お姉さん",
  "サブカル・ストリート",
  "クールビューティー",
  "あざとナチュラル",
  "王道アイドル系",
  "モード・ハイファッション",
  "チャイナ＆コスプレ",
  "メイド・ロリータ",
  "制服・青春ヒロイン",
  "ファム・ファタール（魔性）",
];

/**
 * FNV-1a (32-bit) ハッシュ関数
 */
export function fnv1aHash(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * サブシード生成ヘルパー（xorshift32ベース）
 */
function nextRand(seed: number, step: number): number {
  let x = (seed + Math.imul(step, 0x9e3779b9)) >>> 0;
  if (x === 0) x = 0x6d2b79f5;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

/**
 * 日本時間 (JST) ベースの YYYYMMDD 文字列を取得
 */
export function getTodayDateString(customDate?: Date): string {
  const now = customDate ?? new Date();
  const jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = jstTime.getUTCFullYear();
  const month = String(jstTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jstTime.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * レアリティ判定
 * UR (0.5%) / SSR (4.5%) / SR (20%) / R (35%) / N (40%)
 */
export function determineRarity(randVal: number): Rarity {
  const roll = randVal % 1000;
  if (roll < 5) return "UR";
  if (roll < 50) return "SSR";
  if (roll < 250) return "SR";
  if (roll < 600) return "R";
  return "N";
}

/**
 * 推定女子力（美貌戦闘力）の算出
 */
function calculateCombatPower(rarity: Rarity, randVal: number, isGap: boolean): number {
  const sub = (randVal >>> 4) % 100;

  // シュール・ギャップ系の場合はたまに極端に低い哀愁数値に
  if (isGap && sub < 25) {
    const funnyLowPowers = [3, 5, 14, 28, 45, 88, 108, 365];
    return funnyLowPowers[randVal % funnyLowPowers.length];
  }

  if (sub === 53) {
    return 530000;
  }

  switch (rarity) {
    case "UR":
      return 5300000 + (randVal % 94699999);
    case "SSR":
      return 530000 + (randVal % 4470000);
    case "SR":
      return 85000 + (randVal % 445000);
    case "R":
      return 8000 + (randVal % 77000);
    case "N":
    default:
      if (sub < 15) {
        return 18 + (randVal % 82);
      }
      return 1200 + (randVal % 6800);
  }
}

/**
 * 名前とモードから決定論的に女装二つ名診断結果を生成するメイン関数
 */
export function generateDiagnosis(
  rawName: string,
  mode: DiagnosisMode = "standard",
  dateOverride?: string
): DiagnosisResult {
  const sanitizedName = rawName.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim().slice(0, 32);
  const cleanName = sanitizedName || "名無しのシンデレラ";

  const validDateOverride =
    dateOverride && /^\d{8}$/.test(dateOverride) ? dateOverride : undefined;
  const dateStr = mode === "daily" ? (validDateOverride || getTodayDateString()) : undefined;
  const seedInput = mode === "daily" ? `JOSOU::${cleanName}::${dateStr}` : `JOSOU::${cleanName}`;

  const seed = fnv1aHash(seedInput);

  const r1 = nextRand(seed, 1);
  const r2 = nextRand(seed, 2);
  const r3 = nextRand(seed, 3);
  const r4 = nextRand(seed, 4);
  const r5 = nextRand(seed, 5);
  const r6 = nextRand(seed, 6);
  const r7 = nextRand(seed, 7);
  const r8 = nextRand(seed, 8);

  const prefix = PREFIXES[r1 % PREFIXES.length];

  // 85% 王道美少女 / 15% あるあるシュールギャップ
  const isGap = (r2 % 100) < 15;
  const suffixList = isGap ? GAP_SUFFIXES : COOL_SUFFIXES;
  const suffix = suffixList[r3 % suffixList.length];

  const fullTitle = `${prefix}${suffix}`;
  const rarity = determineRarity(r4);
  const combatPower = calculateCombatPower(rarity, r5, isGap);
  const combatPowerFormatted = combatPower.toLocaleString("ja-JP");

  const skill = SKILLS[r6 % SKILLS.length];
  const flavorText = FLAVOR_TEXTS[r7 % FLAVOR_TEXTS.length];
  const attribute = ATTRIBUTES[r8 % ATTRIBUTES.length];

  const rarityBonus =
    rarity === "UR" ? 35 : rarity === "SSR" ? 25 : rarity === "SR" ? 15 : rarity === "R" ? 8 : 0;

  const calcStat = (step: number) =>
    Math.min(100, Math.max(20, (nextRand(seed, step) % 68) + 15 + rarityBonus));

  return {
    name: cleanName,
    mode,
    dateStr,
    seed,
    prefix,
    suffix,
    fullTitle,
    isGap,
    rarity,
    combatPower,
    combatPowerFormatted,
    skill,
    flavorText,
    stats: {
      make: calcStat(11),
      photo: calcStat(12),
      devil: calcStat(13),
      style: calcStat(14),
      gap: calcStat(15),
    },
    attribute,
  };
}

/**
 * レアリティ別のスタイルメタデータ（小悪魔ピンク×ゴールド仕様）
 */
export const RARITY_META: Record<
  Rarity,
  {
    label: string;
    nameJa: string;
    probability: string;
    badgeBg: string;
    textColor: string;
    borderColor: string;
    glowClass: string;
    isUltraRare: boolean;
  }
> = {
  UR: {
    label: "UR",
    nameJa: "傾国神話級（アルティメットレア）",
    probability: "0.5%",
    badgeBg: "from-pink-500 via-amber-300 to-purple-500",
    textColor: "text-pink-200",
    borderColor: "border-pink-300",
    glowClass: "ur-rainbow-glow",
    isUltraRare: true,
  },
  SSR: {
    label: "SSR",
    nameJa: "国宝美少女級（ダブルスーパーレア）",
    probability: "4.5%",
    badgeBg: "from-rose-400 via-amber-300 to-pink-600",
    textColor: "text-amber-200",
    borderColor: "border-pink-400",
    glowClass: "ssr-gold-glow",
    isUltraRare: true,
  },
  SR: {
    label: "SR",
    nameJa: "小悪魔ヒロイン級（スーパーレア）",
    probability: "20%",
    badgeBg: "from-fuchsia-500 via-pink-500 to-purple-600",
    textColor: "text-pink-300",
    borderColor: "border-pink-400/70",
    glowClass: "sr-purple-glow",
    isUltraRare: false,
  },
  R: {
    label: "R",
    nameJa: "愛されメイク級（レア）",
    probability: "35%",
    badgeBg: "from-purple-500 via-indigo-500 to-pink-500",
    textColor: "text-purple-200",
    borderColor: "border-purple-400/50",
    glowClass: "",
    isUltraRare: false,
  },
  N: {
    label: "N",
    nameJa: "A面ルーキー級（ノーマル）",
    probability: "40%",
    badgeBg: "from-rose-900 via-stone-700 to-pink-900",
    textColor: "text-pink-200",
    borderColor: "border-pink-500/40",
    glowClass: "",
    isUltraRare: false,
  },
};

/**
 * X（旧Twitter）シェア用テキスト生成
 */
export function buildXShareText(result: DiagnosisResult): string {
  const modePrefix = result.mode === "daily" ? "【今日の女装二つ名診断】" : "【女装二つ名診断】";
  return `${modePrefix}${result.name}さんの異名は…\n\n『${result.fullTitle}』（レア度：${result.rarity} / 女子力戦闘力：${result.combatPowerFormatted}）\n固有スキル：${result.skill.name}\n\n#女装二つ名メーカー #女装さんと繋がりたい #男の娘`;
}
