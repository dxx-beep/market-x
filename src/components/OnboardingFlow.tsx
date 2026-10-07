"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Zap, ChevronRight, CheckCircle2 } from "@/lib/lucide";

interface OnboardingFlowProps {
  username: string;
  onChooseRole: (role: "USER" | "SELLER") => Promise<void>;
}

export default function OnboardingFlow({ username, onChooseRole }: OnboardingFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingRole, setLoadingRole] = useState<"USER" | "SELLER" | null>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Phase 1 automatically transitions to Phase 2 after 2.4 seconds
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(2);
        setIsTransitioning(false);
      }, 300);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const handleSelect = async (role: "USER" | "SELLER") => {
    setLoadingRole(role);
    await onChooseRole(role);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {step === 1 && (
        <div className={`text-center py-16 space-y-6 transition-all duration-300 ease-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-fade-in'}`}>
          {/* Subtle minimal badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161618] border border-[#27272a] text-[11px] font-medium tracking-widest uppercase text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            MarketX
          </div>

          {/* Small, refined white-gray greeting */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-100">
              Вітаємо, <span className="text-gray-300 font-semibold">{username}</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Раді бачити вас на платформі цифрових товарів. Налаштовуємо ваш персональний простір...
            </p>
          </div>

          {/* Minimalist progress bar */}
          <div className="w-36 h-1 bg-[#18181b] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gray-500 via-gray-300 to-white w-full animate-progress-indeterminate"></div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-gray-500 hover:text-gray-300 transition underline underline-offset-4"
            >
              Пропустити завантаження →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="py-12 space-y-8 transition-all duration-700 ease-out animate-fade-in-up">
          <div className="text-center space-y-2">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-gray-400">
              Персоналізація профілю
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Оберіть формат взаємодії
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Як ви плануєте використовувати MarketX? Ви зможете перемикатися в будь-який час.
            </p>
          </div>

          <div className="grid gap-4 mt-6">
            {/* Плашка 1: Покупець */}
            <button
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleSelect("USER")}
              className={`w-full group text-left p-5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                loadingRole === "USER"
                  ? "bg-[#18181b] border-gray-400 ring-1 ring-gray-400"
                  : "bg-[#111113] hover:bg-[#18181b] border-[#27272a] hover:border-[#404046]"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#1c1c20] border border-[#2e2e33] flex items-center justify-center shrink-0 group-hover:bg-[#25252b] transition">
                  <ShoppingBag className="w-5 h-5 text-gray-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-100 text-base">Покупець</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#202025] text-gray-400">
                      Базовий
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1 sm:line-clamp-none">
                    Знаходити підписки, ігри та послуги з миттєвою видачею та гарантією
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {loadingRole === "USER" ? (
                  <span className="text-xs text-gray-300 animate-pulse">Вхід...</span>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#1c1c20] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:translate-x-1 transition duration-200">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>

            {/* Плашка 2: Продавець */}
            <button
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleSelect("SELLER")}
              className={`w-full group text-left p-5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                loadingRole === "SELLER"
                  ? "bg-[#18181b] border-gray-400 ring-1 ring-gray-400"
                  : "bg-[#111113] hover:bg-[#18181b] border-[#27272a] hover:border-[#404046]"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#1c1c20] border border-[#2e2e33] flex items-center justify-center shrink-0 group-hover:bg-[#25252b] transition">
                  <Zap className="w-5 h-5 text-gray-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-100 text-base">Продавець</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#202025] text-gray-300">
                      Магазин
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1 sm:line-clamp-none">
                    Створювати товари, автоматизувати видачу ключів та виводити прибуток
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {loadingRole === "SELLER" ? (
                  <span className="text-xs text-gray-300 animate-pulse">Вхід...</span>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#1c1c20] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:translate-x-1 transition duration-200">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Кожен акаунт підтримує безпечні угоди та цілодобову підтримку MarketX.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
