"use client";

import { motion } from "framer-motion";
import { Product } from "../data/products";

interface ProductCardProps {
    product: Product;
    index: number;
    onClick: () => void;
}

// Color mapping for placeholder watch SVGs
const colorMap: Record<string, string> = {
    Silver: "#c0c0c0",
    "Rose Gold": "#e8c4b8",
    Black: "#2a2a2a",
    Blue: "#4a6fa5",
    Champagne: "#f7e7ce",
    Green: "#5a7a5a",
    White: "#f5f5f5",
    Copper: "#b87333",
    Burgundy: "#722f37",
};

export default function ProductCard({
    product,
    index,
    onClick,
}: ProductCardProps) {
    const color = colorMap[product.color] || "#888888";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
            }}
            whileHover={{ scale: 1.02 }}
            className="group relative cursor-pointer"
            onClick={onClick}
        >
            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                {/* Placeholder SVG Watch */}
                <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full p-8 transition-transform duration-500 group-hover:scale-105"
                >
                    {/* Watch body shadow */}
                    <ellipse
                        cx="100"
                        cy="165"
                        rx="50"
                        ry="8"
                        fill="rgba(0,0,0,0.1)"
                        className="transition-all duration-300 group-hover:ry-10 group-hover:fill-[rgba(0,0,0,0.15)]"
                    />

                    {/* Watch case */}
                    <circle
                        cx="100"
                        cy="100"
                        r="65"
                        fill={color}
                        className="transition-all duration-300"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="58"
                        fill="white"
                        fillOpacity="0.1"
                    />

                    {/* Watch dial */}
                    <circle cx="100" cy="100" r="52" fill="#fafafa" />

                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 - 90) * (Math.PI / 180);
                        const x1 = 100 + Math.cos(angle) * 42;
                        const y1 = 100 + Math.sin(angle) * 42;
                        const x2 = 100 + Math.cos(angle) * 48;
                        const y2 = 100 + Math.sin(angle) * 48;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#333"
                                strokeWidth={i % 3 === 0 ? 2 : 1}
                                strokeLinecap="round"
                            />
                        );
                    })}

                    {/* Hour hand */}
                    <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="65"
                        stroke="#1a1a1a"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Minute hand */}
                    <line
                        x1="100"
                        y1="100"
                        x2="130"
                        y2="100"
                        stroke="#1a1a1a"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Center dot */}
                    <circle cx="100" cy="100" r="4" fill="#1a1a1a" />

                    {/* Crown */}
                    <rect
                        x="162"
                        y="95"
                        width="10"
                        height="10"
                        rx="2"
                        fill={color}
                    />
                </svg>
            </div>

            {/* Product Name Overlay - appears on hover */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg"
            >
                <p className="text-white text-sm font-medium">{product.name}</p>
                <p className="text-white/70 text-xs">{product.collection}</p>
            </motion.div>
        </motion.div>
    );
}
