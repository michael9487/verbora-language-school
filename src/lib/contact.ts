// 聯絡表單的欄位規則：瀏覽器即時檢查和伺服器送出前檢查共用同一份，規則只寫一次
// （資料庫 contact_messages 也有對應的 check constraint，是最後一道防線）

import { REGIONS } from "@/data/branches";

export const BRANCHES = REGIONS.flatMap((r) => r.branches.map((b) => b.name));

export type ContactFields = { name: string; phone: string; email: string; branch: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 1000;

const PHONE = /^0\d{1,2}-?\d{6,8}$|^09\d{2}-?\d{3}-?\d{3}$/; // 市話 02-00000100、手機 0912-345-678
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateField(field: keyof ContactFields, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "請輸入姓名";
      if (value.length > 50) return "姓名最多 50 個字";
      return;
    case "phone": {
      const digits = value.replace(/[\s()]/g, "");
      if (!digits) return "請輸入聯絡電話";
      if (!PHONE.test(digits)) return "電話格式不正確，例如 0912-345-678 或 02-0000-0100";
      return;
    }
    case "email":
      if (!value) return "請輸入 Email";
      if (!EMAIL.test(value) || value.length > 254) return "Email 格式不正確";
      return;
    case "branch":
      if (value && !BRANCHES.includes(value)) return "請從清單選擇校區";
      return;
    case "message":
      if (value.length < MESSAGE_MIN) return `請至少輸入 ${MESSAGE_MIN} 個字，讓我們了解您的需求`;
      if (value.length > MESSAGE_MAX) return `最多 ${MESSAGE_MAX} 個字`;
      return;
  }
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  for (const key of Object.keys(fields) as (keyof ContactFields)[]) {
    const err = validateField(key, fields[key]);
    if (err) errors[key] = err;
  }
  return errors;
}

/** 存進資料庫前的格式統一：電話去掉空白、括號 */
export function normalizeContact(fields: ContactFields): ContactFields {
  return {
    name: fields.name.trim(),
    phone: fields.phone.replace(/[\s()]/g, ""),
    email: fields.email.trim().toLowerCase(),
    branch: fields.branch.trim(),
    message: fields.message.trim(),
  };
}
