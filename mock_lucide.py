import os
import re

base_dir = r"C:\Users\lukia\.gemini\antigravity\scratch\market-x\src"

mock_lucide = """
import React from 'react';
export const Search = () => <span>[S]</span>;
export const ShoppingCart = () => <span>[C]</span>;
export const Bell = () => <span>[B]</span>;
export const User = () => <span>[U]</span>;
export const MessageSquare = () => <span>[M]</span>;
export const ChevronRight = () => <span>[&gt;]</span>;
export const Gamepad2 = () => <span>[G]</span>;
export const MessageCircle = () => <span>[M]</span>;
export const Cpu = () => <span>[CPU]</span>;
export const ShoppingBag = () => <span>[SB]</span>;
export const Gift = () => <span>[Gift]</span>;
export const Share2 = () => <span>[Share]</span>;
export const Terminal = () => <span>[T]</span>;
export const Filter = () => <span>[F]</span>;
export const Heart = () => <span>[H]</span>;
export const ShieldCheck = () => <span>[Shield]</span>;
export const Zap = () => <span>[Z]</span>;
export const Users = () => <span>[Us]</span>;
export const ShieldAlert = () => <span>[SA]</span>;
export const Hash = () => <span>[#]</span>;
export const DollarSign = () => <span>[$]</span>;
export const TrendingUp = () => <span>[Tr]</span>;
export const Star = () => <span>[*]</span>;
export const Lock = () => <span>[L]</span>;
export const Mail = () => <span>[Mail]</span>;
export const Trash2 = () => <span>[Trash]</span>;
export const Package = () => <span>[P]</span>;
export const Wallet = () => <span>[W]</span>;
export const Settings = () => <span>[Set]</span>;
export const Activity = () => <span>[A]</span>;
"""

with open(os.path.join(base_dir, "lib", "lucide.tsx"), "w", encoding="utf-8") as f:
    f.write(mock_lucide)

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # replace import { ... } from "lucide-react" with import { ... } from "@/lib/lucide"
            new_content = re.sub(r'from\s+"lucide-react"', 'from "@/lib/lucide"', content)
            
            if new_content != content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)

print("Replaced lucide-react with local mock")
