"use client";

import { motion } from "framer-motion";
import { products, Product } from "../data/products";

interface ListViewProps {
    onProductSelect: (product: Product) => void;
    onViewChange: () => void;
}

export default function ListView({ onProductSelect, onViewChange }: ListViewProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border">
                <h1 className="text-xl font-medium tracking-tight">showcase</h1>

                {/* View Toggle */}
                <button
                    onClick={onViewChange}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-border text-sm hover:bg-foreground hover:text-background transition-all duration-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="group-hover:hidden">一覧ビュー</span>
                    <span className="hidden group-hover:inline">体験ビューへ</span>
                </button>
            </header>

            {/* Product Grid */}
            <main className="pt-24 px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-semibold mb-8"
                    >
                        全商品
                    </motion.h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group cursor-pointer"
                                onClick={() => onProductSelect(product)}
                            >
                                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 relative">
                                    {/* Shadow */}
                                    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[8%] bg-black/10 blur-md rounded-full" />
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 relative z-10 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="font-medium text-sm">{product.name}</h3>
                                <p className="text-muted text-sm">{product.price}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
