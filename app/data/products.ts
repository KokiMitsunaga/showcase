export interface Product {
    id: string;
    name: string;
    collection: string;
    description: string;
    price: string;
    color: string;
    material: string;
    imageUrl: string;
}

// 商品データ - 腕時計コレクション
export const products: Product[] = [
    {
        id: "1",
        name: "クラシック シルバー",
        collection: "タイムレス",
        description:
            "エレガンスと精密さを兼ね備えたタイムレスなデザイン。研磨されたシルバーケースとミニマルな文字盤が、あらゆるシーンに映える洗練されたルックスを生み出します。",
        price: "¥45,000",
        color: "Silver",
        material: "ステンレススチール",
        imageUrl: "/products/watch-1.png",
    },
    {
        id: "2",
        name: "ローズゴールド エリート",
        collection: "リュクス",
        description:
            "細部まで丁寧に作り込まれたローズゴールドのタイムピース。温かみと洗練さを兼ね備え、モダンな美学とクラシックな魅力の完璧な融合を実現しています。",
        price: "¥68,000",
        color: "Rose Gold",
        material: "18Kローズゴールドプレーティング",
        imageUrl: "/products/watch-2.png",
    },
    {
        id: "3",
        name: "ミッドナイト ブラック",
        collection: "シャドウ",
        description:
            "大胆でミステリアスなミッドナイトブラック。オールブラックのデザインとさりげないアクセントが、控えめなラグジュアリーを愛する方に語りかけます。",
        price: "¥52,000",
        color: "Black",
        material: "PVDコーティングスチール",
        imageUrl: "/products/watch-3.png",
    },
    {
        id: "4",
        name: "オーシャン ブルー",
        collection: "マリン",
        description:
            "海の深さからインスピレーションを得たこのピースは、光を美しく捉える魅力的なブルーダイヤルを特徴としています。防水性能を備え、冒険の準備は万端です。",
        price: "¥58,000",
        color: "Blue",
        material: "チタニウム",
        imageUrl: "/products/watch-4.png",
    },
    {
        id: "5",
        name: "シャンパン ドリーム",
        collection: "リュクス",
        description:
            "このシャンパントーンのマスターピースで、あらゆる瞬間を祝福しましょう。温かみのあるゴールデンヒューが、日常に特別な輝きを添えます。",
        price: "¥72,000",
        color: "Champagne",
        material: "ゴールドプレーティング",
        imageUrl: "/products/watch-5.png",
    },
    {
        id: "6",
        name: "フォレスト グリーン",
        collection: "ネイチャー",
        description:
            "このアースグリーンのタイムピースで自然とつながりましょう。サステナブルな素材と洗練されたデザインが融合した、エコ意識の高いクリエーション。",
        price: "¥48,000",
        color: "Green",
        material: "リサイクルチタニウム",
        imageUrl: "/products/watch-6.png",
    },
    {
        id: "7",
        name: "パール ホワイト",
        collection: "タイムレス",
        description:
            "純粋でエレガントなパールホワイトは、シンプリシティの極みを体現しています。クリーンで明るい文字盤が、あらゆるスタイルを優雅に引き立てます。",
        price: "¥42,000",
        color: "White",
        material: "セラミック",
        imageUrl: "/products/watch-7.png",
    },
    {
        id: "8",
        name: "コッパー サンセット",
        collection: "ネイチャー",
        description:
            "温かみのあるコッパートーンが夕日の美しさを連想させます。このユニークなタイムピースが、自然の温もりと職人技の輝きを手元にお届けします。",
        price: "¥55,000",
        color: "Copper",
        material: "ブロンズ",
        imageUrl: "/products/watch-8.png",
    },
    {
        id: "9",
        name: "バーガンディ クラシック",
        collection: "ヘリテージ",
        description:
            "リッチなバーガンディレザーとヴィンテージインスパイアのデザインが出会う一品。伝統的な時計製造へのオマージュと、現代的な快適さと信頼性を兼ね備えています。",
        price: "¥49,000",
        color: "Burgundy",
        material: "ステンレススチール",
        imageUrl: "/products/watch-9.png",
    },
];
