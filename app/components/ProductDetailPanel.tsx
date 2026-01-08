"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../data/products";

interface ProductDetailPanelProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

// Color mapping for watches
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

export default function ProductDetailPanel({
    product,
    isOpen,
    onClose,
}: ProductDetailPanelProps) {
    if (!product) return null;



    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed left-0 top-0 bottom-0 w-full md:w-[50%] lg:w-[45%] bg-white z-50 shadow-2xl overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-gray-50 transition-colors z-10"
                        aria-label="Close"
                    >
                        <svg
                            className="w-5 h-5"
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

                    <div className="min-h-full flex flex-col">
                        {/* Brand */}
                        <div className="px-8 pt-8">
                            <span className="text-sm font-medium text-muted">showcase</span>
                        </div>

                        {/* Product Title */}
                        <div className="px-8 py-4">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl lg:text-3xl font-semibold tracking-tight leading-tight"
                            >
                                {product.name}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-sm text-muted mt-1"
                            >
                                {product.collection} コレクション
                            </motion.p>
                        </div>

                        {/* Product Image - Full width */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 }}
                            className="px-8 py-8 flex-1 flex items-center justify-center bg-gray-50"
                        >
                            <div className="w-full max-w-sm aspect-square relative">
                                {/* Shadow */}
                                <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[70%] h-[10%] bg-black/20 blur-xl rounded-full" />
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain relative z-10 drop-shadow-lg"
                                />
                            </div>
                        </motion.div>

                        {/* Color Swatches */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="px-8 py-6 flex gap-3"
                        >
                            {Object.entries(colorMap).slice(0, 4).map(([name, hex]) => (
                                <button
                                    key={name}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${name === product.color
                                        ? "border-foreground scale-110"
                                        : "border-transparent hover:border-gray-300"
                                        }`}
                                    style={{ backgroundColor: hex }}
                                    title={name}
                                />
                            ))}
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="px-8 pb-8"
                        >
                            <p className="text-muted text-base leading-relaxed mb-6">
                                {product.description}
                            </p>

                            <div className="text-sm text-muted mb-6">
                                {product.material}
                            </div>

                            {/* CTA */}
                            <button className="w-full py-4 bg-foreground text-background font-medium rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2">
                                コレクションを見る
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
