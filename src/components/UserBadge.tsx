"use client";

import React from "react";

export type BadgeCategory = "SYSTEM" | "ACHIEVEMENT" | "COSMETIC";

export interface BadgeModel {
  id?: string;
  key: string;
  name: string;
  icon: string;
  color: string;
  description?: string | null;
  category?: BadgeCategory | string;
  priority: number;
  isActive?: boolean;
  assignedAt?: Date | string | null;
}

export type BadgeVariant = "pill" | "icon" | "banner" | "compact";

export const BADGE_CATALOG: Record<string, BadgeModel> = {
  OWNER: {
    key: "OWNER",
    name: "Owner",
    icon: "/badges/owner-crown.gif",
    color: "#f59e0b",
    description: "Власник та творець платформи MarketX",
    category: "SYSTEM",
    priority: 100,
  },
  ADMIN: {
    key: "ADMIN",
    name: "Admin",
    icon: "/badges/admin-crown.gif",
    color: "#ef4444",
    description: "Адміністратор системи та модерації",
    category: "SYSTEM",
    priority: 90,
  },
  MODERATOR: {
    key: "MODERATOR",
    name: "Moderator",
    icon: "/badges/admin-role.png",
    color: "#3b82f6",
    description: "Модератор спільноти та безпеки угод",
    category: "SYSTEM",
    priority: 85,
  },
  DEVELOPER: {
    key: "DEVELOPER",
    name: "Developer",
    icon: "/badges/dev-code.gif",
    color: "#22d3ee",
    description: "Розробник платформи MarketX",
    category: "SYSTEM",
    priority: 80,
  },
  DEV: {
    key: "DEV",
    name: "Developer",
    icon: "/badges/dev-code.gif",
    color: "#22d3ee",
    description: "Розробник платформи MarketX",
    category: "SYSTEM",
    priority: 80,
  },
  VERIFIED: {
    key: "VERIFIED",
    name: "Verified",
    icon: "/badges/verified.gif",
    color: "#10b981",
    description: "Підтверджений надійний користувач / продавець",
    category: "SYSTEM",
    priority: 70,
  },
  SELLER: {
    key: "SELLER",
    name: "Seller",
    icon: "/badges/seller-coin.gif",
    color: "#a855f7",
    description: "Офіційний верифікований продавець",
    category: "SYSTEM",
    priority: 60,
  },
  TOP_SELLER: {
    key: "TOP_SELLER",
    name: "Top Seller",
    icon: "/badges/seller-cart.gif",
    color: "#ec4899",
    description: "Топ-продавець з понад 100+ успішними угодами",
    category: "ACHIEVEMENT",
    priority: 55,
  },
  VIP: {
    key: "VIP",
    name: "VIP",
    icon: "/badges/vip-diamond.gif",
    color: "#d946ef",
    description: "Преміальний VIP статус користувача",
    category: "COSMETIC",
    priority: 50,
  },
  NITRO: {
    key: "NITRO",
    name: "Nitro",
    icon: "/badges/nitro.gif",
    color: "#6366f1",
    description: "Бустер сервера та спільноти платформи",
    category: "COSMETIC",
    priority: 40,
  },
  SUPPORTER: {
    key: "SUPPORTER",
    name: "Supporter",
    icon: "/badges/vip-booster.gif",
    color: "#14b8a6",
    description: "Користувач, що підтримав розвиток платформи",
    category: "ACHIEVEMENT",
    priority: 35,
  },
  EARLY_USER: {
    key: "EARLY_USER",
    name: "Early User",
    icon: "/badges/owner-sparkle.gif",
    color: "#f97316",
    description: "Учасник раннього запуску MarketX (OG)",
    category: "ACHIEVEMENT",
    priority: 30,
  },
  BUYER: {
    key: "BUYER",
    name: "Buyer",
    icon: "/badges/buyer.svg",
    color: "#9ca3af",
    description: "Покупець цифрових товарів",
    category: "SYSTEM",
    priority: 10,
  },
};

export const DEFAULT_ROLE_BADGES: Record<string, string[]> = {
  ADMIN: ["ADMIN"],
  SELLER: ["SELLER"],
  MODERATOR: ["MODERATOR"],
  USER: ["BUYER"],
};

export function resolveBadge(input: any): BadgeModel | null {
  if (!input) return null;
  // If it's a UserBadge relation { badge: {...}, assignedAt: ... }
  if (input.badge && typeof input.badge === "object") {
    return {
      ...input.badge,
      assignedAt: input.assignedAt || input.badge.createdAt,
    };
  }
  // If it's already a full Badge object
  if (typeof input === "object" && input.key) {
    const catalog = BADGE_CATALOG[input.key.toUpperCase()] || {};
    return {
      ...catalog,
      ...input,
    };
  }
  // If it's a string key
  if (typeof input === "string") {
    const key = input.toUpperCase().trim();
    return BADGE_CATALOG[key] || {
      key,
      name: key,
      icon: "/badges/buyer.svg",
      color: "#9ca3af",
      description: "Користувацький статус",
      category: "SYSTEM",
      priority: 10,
    };
  }
  return null;
}

interface UserBadgeProps {
  badge: any;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showTooltip?: boolean;
}

export function UserBadge({
  badge: rawBadge,
  variant = "pill",
  size = "sm",
  showIcon = true,
  showTooltip = true,
}: UserBadgeProps) {
  const badge = resolveBadge(rawBadge);
  if (!badge) return null;

  const hex = badge.color || "#9ca3af";

  // Category translation
  const catLabel =
    badge.category === "SYSTEM"
      ? "Системний бейдж"
      : badge.category === "ACHIEVEMENT"
      ? "Досягнення"
      : badge.category === "COSMETIC"
      ? "Косметичний"
      : "Особливий статус";

  const formattedDate = badge.assignedAt
    ? new Date(badge.assignedAt).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : null;

  const sizeClasses = {
    sm: { pill: "h-5 pl-1 pr-2 gap-1.5 text-[10px]", icon: "w-5 h-5", img: "w-3.5 h-3.5" },
    md: { pill: "h-6 pl-1 pr-2.5 gap-2 text-[11px]", icon: "w-6 h-6", img: "w-4 h-4" },
    lg: { pill: "h-7.5 pl-1.5 pr-3.5 gap-2.5 text-xs", icon: "w-7.5 h-7.5", img: "w-5 h-5" },
  }[size];

  // Tooltip element
  const tooltipElement = showTooltip && (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col w-52 p-2.5 rounded-xl bg-[#0f0f12] border border-[#27272e] shadow-2xl z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200"
      style={{
        boxShadow: `0 10px 25px -5px rgba(0,0,0,0.8)`,
      }}
    >
      <div className="flex items-center gap-2 border-b border-[#1f1f24] pb-1.5 mb-1.5">
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
          style={{ background: `${hex}20` }}
        >
          <img src={badge.icon} alt={badge.name} className="w-3.5 h-3.5 object-contain" />
        </span>
        <div className="min-w-0">
          <span className="text-xs font-bold text-gray-100 truncate block">
            {badge.name}
          </span>
        </div>
      </div>

      {badge.description && (
        <p className="text-[11px] text-gray-300 leading-snug mb-2 font-normal">
          {badge.description}
        </p>
      )}

      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1 border-t border-[#1a1a20]">
        <span style={{ color: hex }} className="font-semibold">
          {catLabel}
        </span>
        {formattedDate && <span>Отримано: {formattedDate}</span>}
      </div>

      {/* Tiny arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-[#0f0f12] border-r border-b border-[#27272e]"></div>
    </div>
  );

  // Variant: Icon only
  if (variant === "icon") {
    return (
      <div className="relative group inline-flex items-center shrink-0">
        <span
          className={`${sizeClasses.icon} rounded-full flex items-center justify-center shrink-0 overflow-hidden transition duration-200 hover:scale-110 cursor-help`}
          style={{
            background: `${hex}18`,
            boxShadow: `inset 0 0 0 1px ${hex}40`,
          }}
        >
          <img
            src={badge.icon}
            alt={badge.name}
            className={`${sizeClasses.img} object-contain p-[1px]`}
          />
        </span>
        {tooltipElement}
      </div>
    );
  }

  // Variant: Banner (Forum wide rank banner)
  if (variant === "banner") {
    return (
      <div className="relative group inline-flex items-center">
        <div
          className="badge-card-hover relative inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider select-none overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-help"
          style={{
            background: `linear-gradient(135deg, ${hex}25, ${hex}08)`,
            boxShadow: `inset 0 0 0 1px ${hex}50`,
            color: hex,
          }}
        >
          {showIcon && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ background: `${hex}25` }}
            >
              <img src={badge.icon} alt={badge.name} className="w-3.5 h-3.5 object-contain" />
            </span>
          )}
          <span className="font-semibold text-gray-100">{badge.name}</span>
        </div>
        {tooltipElement}
      </div>
    );
  }

  // Variant: Compact (Minimal tag)
  if (variant === "compact") {
    return (
      <div className="relative group inline-flex items-center shrink-0">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium tracking-tight select-none transition duration-200 hover:scale-105 cursor-help"
          style={{
            background: `${hex}15`,
            color: hex,
            border: `1px solid ${hex}35`,
          }}
        >
          {showIcon && (
            <img src={badge.icon} alt={badge.name} className="w-3 h-3 object-contain shrink-0" />
          )}
          <span>{badge.name}</span>
        </span>
        {tooltipElement}
      </div>
    );
  }

  // Variant: Pill (Default sleek dark capsule with sweep)
  return (
    <div className="relative group inline-flex items-center shrink-0">
      <span
        className={`badge-pill relative inline-flex items-center rounded-full font-semibold select-none overflow-hidden whitespace-nowrap transition-all duration-200 hover:scale-[1.02] cursor-help ${sizeClasses.pill}`}
        style={{
          background: `linear-gradient(180deg, ${hex}18, ${hex}08)`,
          boxShadow: `inset 0 0 0 1px ${hex}45`,
          color: "#f3f4f6",
        }}
      >
        {showIcon && (
          <span
            className="rounded-full flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              width: size === "sm" ? "14px" : size === "md" ? "16px" : "18px",
              height: size === "sm" ? "14px" : size === "md" ? "16px" : "18px",
              background: `${hex}25`,
            }}
          >
            <img
              src={badge.icon}
              alt={badge.name}
              className="w-full h-full object-contain p-[1px]"
            />
          </span>
        )}
        <span style={{ color: hex }} className="tracking-wide">
          {badge.name}
        </span>
      </span>
      {tooltipElement}
    </div>
  );
}

/**
 * High-craft container component for rendering user badges with:
 * - Priority sorting (highest first)
 * - Max limit control
 * - Overflow (+N) indicator with interactive popover
 * - Role-based fallbacks
 */
interface UserBadgesProps {
  badges?: any[] | null;
  role?: string;
  max?: number;
  overflow?: boolean;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
}

export function UserBadges({
  badges: rawBadges,
  role,
  max,
  overflow = true,
  variant = "pill",
  size = "sm",
}: UserBadgesProps) {
  let list: BadgeModel[] = [];

  if (Array.isArray(rawBadges) && rawBadges.length > 0) {
    for (const item of rawBadges) {
      const b = resolveBadge(item);
      if (b && b.isActive !== false) list.push(b);
    }
  }

  // Fallback to role-based badge if list is empty
  if (list.length === 0 && role) {
    const defaultKeys = DEFAULT_ROLE_BADGES[role.toUpperCase()] || ["BUYER"];
    for (const key of defaultKeys) {
      const b = resolveBadge(key);
      if (b) list.push(b);
    }
  }

  if (list.length === 0) return null;

  // Deduplicate by key
  const uniqueMap = new Map<string, BadgeModel>();
  for (const b of list) {
    if (!uniqueMap.has(b.key)) uniqueMap.set(b.key, b);
  }
  const deduplicated = Array.from(uniqueMap.values());

  // Priority sorting: highest priority first
  deduplicated.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const limit = typeof max === "number" && max > 0 ? max : deduplicated.length;
  const visible = deduplicated.slice(0, limit);
  const hidden = deduplicated.slice(limit);

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 align-middle">
      {visible.map((b) => (
        <UserBadge
          key={b.key}
          badge={b}
          variant={variant}
          size={size}
          showTooltip={true}
        />
      ))}

      {overflow && hidden.length > 0 && (
        <div className="relative group inline-flex items-center shrink-0">
          <span
            className="h-5 px-1.5 rounded-full text-[10px] font-semibold tracking-wider font-mono bg-[#16161a] border border-[#292932] text-gray-400 hover:text-gray-200 hover:border-gray-600 transition cursor-help select-none flex items-center justify-center"
            title={`Ще ${hidden.length} бейджів`}
          >
            +{hidden.length}
          </span>

          {/* Interactive overflow popover */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex flex-col w-56 p-2 rounded-xl bg-[#0f0f12] border border-[#27272e] shadow-2xl z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 divide-y divide-[#1c1c24]">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 font-mono">
              Додаткові бейджі (+{hidden.length})
            </div>
            <div className="p-1.5 space-y-1.5 max-h-48 overflow-y-auto">
              {hidden.map((b) => (
                <div key={b.key} className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#15151a] transition">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: `${b.color}20` }}
                  >
                    <img src={b.icon} alt={b.name} className="w-3.5 h-3.5 object-contain" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-gray-200 block truncate">
                      {b.name}
                    </span>
                    {b.description && (
                      <span className="text-[10px] text-gray-400 block truncate">
                        {b.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default export for backwards compatibility
export default UserBadge;
