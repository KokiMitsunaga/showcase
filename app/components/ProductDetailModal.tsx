"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../data/products";

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
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

export default function ProductDetailModal({
    product,
    isOpen,
    onClose,
}: ProductDetailModalProps) {
    if (!product) return null;

    const color = colorMap[product.color] || "#888888";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-custom z-40"
                        onClick={onClose}
                    />

                    {/* Modal Panel - Slides from left */}
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[55%] bg-background z-50 overflow-y-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
                            aria-label="Close"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Product Image Section */}
                            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="w-full max-w-md"
                                >
                                    {/* Large Watch SVG */}
                                    <svg viewBox="0 0 200 200" className="w-full h-auto">
                                        {/* Watch body shadow */}
                                        <ellipse
                                            cx="100"
                                            cy="170"
                                            rx="55"
                                            ry="10"
                                            fill="rgba(0,0,0,0.1)"
                                        />

                                        {/* Watch case */}
                                        <circle cx="100" cy="100" r="70" fill={color} />
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="62"
                                            fill="white"
                                            fillOpacity="0.1"
                                        />

                                        {/* Watch dial */}
                                        <circle cx="100" cy="100" r="55" fill="#fafafa" />

                                        {/* Hour markers */}
                                        {[...Array(12)].map((_, i) => {
                                            const angle = (i * 30 - 90) * (Math.PI / 180);
                                            const x1 = 100 + Math.cos(angle) * 44;
                                            const y1 = 100 + Math.sin(angle) * 44;
                                            const x2 = 100 + Math.cos(angle) * 50;
                                            const y2 = 100 + Math.sin(angle) * 50;
                                            return (
                                                <line
                                                    key={i}
                                                    x1={x1}
                                                    y1={y1}
                                                    x2={x2}
                                                    y2={y2}
                                                    stroke="#333"
                                                    strokeWidth={i % 3 === 0 ? 2.5 : 1}
                                                    strokeLinecap="round"
                                                />
                                            );
                                        })}

                                        {/* Hour hand */}
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2="100"
                                            y2="60"
                                            stroke="#1a1a1a"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />

                                        {/* Minute hand */}
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2="135"
                                            y2="100"
                                            stroke="#1a1a1a"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />

                                        {/* Center dot */}
                                        <circle cx="100" cy="100" r="5" fill="#1a1a1a" />

                                        {/* Crown */}
                                        <rect
                                            x="168"
                                            y="93"
                                            width="12"
                                            height="14"
                                            rx="3"
                                            fill={color}
                                        />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Product Details Section */}
                            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                >
                                    {/* Collection Tag */}
                                    <span className="text-xs uppercase tracking-widest text-muted mb-4 block">
                                        {product.collection} collection
                                    </span>

                                    {/* Product Name */}
                                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight mb-6 leading-tight">
                                        {product.name}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-muted text-base lg:text-lg leading-relaxed mb-8">
                                        {product.description}
                                    </p>

                                    {/* Specs */}
                                    <div className="space-y-3 mb-10">
                                        <div className="flex items-center justify-between py-2 border-b border-border">
                                            <span className="text-sm text-muted">Material</span>
                                            <span className="text-sm font-medium">
                                                {product.material}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-border">
                                            <span className="text-sm text-muted">Color</span>
                                            <span className="text-sm font-medium">{product.color}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-border">
                                            <span className="text-sm text-muted">Price</span>
                                            <span className="text-sm font-medium">{product.price}</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button className="w-full py-4 bg-foreground text-background font-medium rounded-full hover:bg-accent transition-colors">
                                        Explore Collection
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
