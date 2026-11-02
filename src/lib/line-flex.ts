// 分享到 LINE 的 Flex Message 卡片（liff.shareTargetPicker 用）
// 圖片、連結都必須是 https 絕對網址，中文路徑要先編碼
import { SITE_NAME } from "@/lib/site";

export type ShareCard = {
  title: string;
  subtitle?: string;
  /** 站內路徑或絕對網址 */
  url: string;
  image?: string;
  buttonLabel?: string;
};

export function absoluteUrl(pathOrUrl: string, origin: string) {
  return encodeURI(decodeURI(new URL(pathOrUrl, origin).toString()));
}

export function buildShareMessage(card: ShareCard, origin: string) {
  const url = absoluteUrl(card.url, origin);
  return {
    type: "flex" as const,
    altText: `${card.title}｜${SITE_NAME}`.slice(0, 400),
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: absoluteUrl(card.image ?? "/images/home/hero.jpg", origin),
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        action: { type: "uri", uri: url },
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: SITE_NAME, size: "xs", color: "#1E6EC8", weight: "bold" },
          { type: "text", text: card.title, size: "md", weight: "bold", wrap: true, color: "#2C2C2C" },
          ...(card.subtitle ? [{ type: "text", text: card.subtitle, size: "sm", color: "#787877", wrap: true }] : []),
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#1E6EC8",
            height: "sm",
            action: { type: "uri", label: card.buttonLabel ?? "查看詳情", uri: url },
          },
        ],
      },
    },
  };
}
