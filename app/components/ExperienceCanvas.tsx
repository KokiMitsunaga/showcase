"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, Product } from "../data/products";

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

// Size variations for products
const sizeVariations = [0.7, 0.85, 1, 1.15, 0.9, 1.1, 0.8, 1.05, 0.95];

// Grid spacing - wider for more breathing room
const SPACING_X = 300;
const SPACING_Y = 270;

// Grid size - fewer items to maintain similar canvas area with wider spacing
const COLS = 7;
const ROWS = 6;
const TOTAL_POSITIONS = COLS * ROWS;

// Calculate grid dimensions
const GRID_WIDTH = COLS * SPACING_X;
const GRID_HEIGHT = ROWS * SPACING_Y;

// Center the grid so position (0,0) shows items in the viewport
// Grid spans from -offset to (grid_size - offset)
const GRID_OFFSET_X = 300; // Items start at -300
const GRID_OFFSET_Y = 200; // Items start at -200

// Deterministic pseudo-random function based on seed
const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};

// Staggered grid positions that fill the entire canvas area
const getProductPositions = () => {
    const positions: { x: number; y: number; size: number }[] = [];

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const index = row * COLS + col;
            // Staggered offset for odd rows
            const staggerOffset = row % 2 === 1 ? SPACING_X / 2 : 0;

            // Deterministic offset for organic feel (no Math.random)
            const randomOffsetX = (seededRandom(index * 2) - 0.5) * 50;
            const randomOffsetY = (seededRandom(index * 2 + 1) - 0.5) * 40;

            // Position centered around viewport
            positions.push({
                x: col * SPACING_X + staggerOffset + randomOffsetX - GRID_OFFSET_X,
                y: row * SPACING_Y + randomOffsetY - GRID_OFFSET_Y,
                size: sizeVariations[index % sizeVariations.length],
            });
        }
    }

    return positions;
};

interface ExperienceCanvasProps {
    onProductSelect: (product: Product) => void;
    selectedProduct: Product | null;
    onCanvasClick?: () => void;
    onViewChange?: () => void;
}

// Canvas bounds - calculated from grid size
// Allows scrolling to see the entire grid
const getCanvasBounds = (scale: number, viewportWidth: number, viewportHeight: number) => {
    // Scaled grid dimensions
    const scaledGridWidth = GRID_WIDTH * scale;
    const scaledGridHeight = GRID_HEIGHT * scale;

    // Calculate bounds based on current scale
    // When zoomed out, there's less room to pan
    const maxPanX = Math.max(0, scaledGridWidth - viewportWidth);
    const maxPanY = Math.max(0, scaledGridHeight - viewportHeight);

    return {
        minX: -maxPanX + (GRID_OFFSET_X * scale),
        maxX: GRID_OFFSET_X * scale + 50,
        minY: -maxPanY + (GRID_OFFSET_Y * scale),
        maxY: GRID_OFFSET_Y * scale + 50,
    };
};

// Calculate minimum scale where grid fills viewport
const getMinScale = (viewportWidth: number, viewportHeight: number) => {
    const scaleX = viewportWidth / GRID_WIDTH;
    const scaleY = viewportHeight / GRID_HEIGHT;
    // Use the larger of the two to ensure grid fills viewport
    return Math.max(scaleX, scaleY, 0.4); // Minimum 0.4 to prevent too small
};

export default function ExperienceCanvas({
    onProductSelect,
    selectedProduct,
    onCanvasClick,
    onViewChange
}: ExperienceCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [positions] = useState(() => getProductPositions());
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
    const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });

    // Ensure client-side only rendering to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        setViewportSize({ width: window.innerWidth, height: window.innerHeight });

        const handleResize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate dynamic bounds and min scale
    const minScale = getMinScale(viewportSize.width, viewportSize.height);
    const canvasBounds = getCanvasBounds(scale, viewportSize.width, viewportSize.height);

    // Clamp position within bounds
    const clampPosition = useCallback((pos: { x: number; y: number }) => ({
        x: Math.min(Math.max(pos.x, canvasBounds.minX), canvasBounds.maxX),
        y: Math.min(Math.max(pos.y, canvasBounds.minY), canvasBounds.maxY),
    }), [canvasBounds]);

    // Create enough products to fill all grid positions (memoized to prevent re-creation)
    const extendedProducts = useMemo(() =>
        Array.from({ length: TOTAL_POSITIONS }, (_, index) => {
            const baseProduct = products[index % products.length];
            return {
                ...baseProduct,
                id: index === 0 ? baseProduct.id : `${baseProduct.id}_${index}`,
            };
        }),
        []);

    // Check which products are visible in the viewport
    useEffect(() => {
        const checkVisibility = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const newVisible = new Set<string>();

            extendedProducts.forEach((product, index) => {
                const pos = positions[index];
                if (!pos) return;

                // Calculate product position on screen
                const screenX = (pos.x * scale) + position.x;
                const screenY = (pos.y * scale) + position.y;
                const productSize = 140 * pos.size * scale;

                // Negative margin = items only visible when well inside viewport (closer to center)
                const margin = -150;
                if (
                    screenX > -productSize - margin &&
                    screenX < viewportWidth + margin &&
                    screenY > -productSize - margin &&
                    screenY < viewportHeight + margin
                ) {
                    newVisible.add(product.id);
                }
            });

            setVisibleProducts(newVisible);
        };

        checkVisibility();
    }, [position, scale, positions]);

    // Prevent browser back/forward gesture with passive: false event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Prevent default on wheel to stop browser navigation
        const handleWheelNative = (e: WheelEvent) => {
            e.preventDefault();
        };

        // Prevent default on touchmove to stop browser navigation
        const handleTouchMoveNative = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        };

        container.addEventListener('wheel', handleWheelNative, { passive: false });
        container.addEventListener('touchmove', handleTouchMoveNative, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheelNative);
            container.removeEventListener('touchmove', handleTouchMoveNative);
        };
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.product-item')) return;
        setIsDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }, [position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (!isDragging) return;
        const newPos = {
            x: e.clientX - startPos.x,
            y: e.clientY - startPos.y,
        };
        setPosition(clampPosition(newPos));
    }, [isDragging, startPos]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        // Check if this was a click (not a drag) on empty canvas space
        const isProductClick = (e.target as HTMLElement).closest('.product-item');
        const dragDistance = Math.abs(e.clientX - startPos.x - position.x) + Math.abs(e.clientY - startPos.y - position.y);

        if (!isProductClick && dragDistance < 5 && onCanvasClick) {
            onCanvasClick();
        }
        setIsDragging(false);
    }, [startPos, position, onCanvasClick]);

    // Touch handlers for mobile/trackpad
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStart.x;
            const deltaY = touch.clientY - touchStart.y;
            const newPos = {
                x: position.x + deltaX,
                y: position.y + deltaY,
            };
            setPosition(clampPosition(newPos));
            setTouchStart({ x: touch.clientX, y: touch.clientY });
        }
    }, [position, touchStart]);

    // Two-finger scroll = pan, Ctrl+scroll = zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        // Ctrl + scroll = zoom (pinch-to-zoom on trackpad)
        if (e.ctrlKey || e.metaKey) {
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            const newScale = Math.min(Math.max(scale + delta, minScale), 2);
            setScale(newScale);
            // Adjust position to stay within new bounds
            const newBounds = getCanvasBounds(newScale, viewportSize.width, viewportSize.height);
            setPosition(prev => ({
                x: Math.min(Math.max(prev.x, newBounds.minX), newBounds.maxX),
                y: Math.min(Math.max(prev.y, newBounds.minY), newBounds.maxY),
            }));
        } else {
            // Regular scroll/two-finger drag = pan
            const newPos = {
                x: position.x - e.deltaX,
                y: position.y - e.deltaY,
            };
            setPosition(clampPosition(newPos));
        }
    }, [position, scale, minScale, viewportSize, clampPosition]);

    const zoomIn = useCallback(() => {
        const newScale = Math.min(scale + 0.2, 2);
        setScale(newScale);
        // Adjust position for new scale
        const newBounds = getCanvasBounds(newScale, viewportSize.width, viewportSize.height);
        setPosition(prev => ({
            x: Math.min(Math.max(prev.x, newBounds.minX), newBounds.maxX),
            y: Math.min(Math.max(prev.y, newBounds.minY), newBounds.maxY),
        }));
    }, [scale, viewportSize]);

    const zoomOut = useCallback(() => {
        const newScale = Math.max(scale - 0.2, minScale);
        setScale(newScale);
        // Adjust position for new scale (center if zoomed out significantly)
        const newBounds = getCanvasBounds(newScale, viewportSize.width, viewportSize.height);
        setPosition(prev => ({
            x: Math.min(Math.max(prev.x, newBounds.minX), newBounds.maxX),
            y: Math.min(Math.max(prev.y, newBounds.minY), newBounds.maxY),
        }));
    }, [scale, minScale, viewportSize]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden bg-background select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
            {/* Only render canvas content after mounting to prevent hydration mismatch */}
            {mounted && (
                <>
                    <motion.div
                        className="absolute"
                        style={{
                            x: position.x,
                            y: position.y,
                            scale: scale,
                        }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    >
                        {extendedProducts.map((product, index) => {
                            const pos = positions[index];
                            if (!pos) return null;
                            const color = colorMap[product.color] || "#888888";
                            const baseSize = 140 * pos.size;
                            const isVisible = visibleProducts.has(product.id);

                            return (
                                <motion.div
                                    key={product.id}
                                    className="product-item absolute cursor-pointer"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        width: baseSize,
                                        height: baseSize,
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isVisible ? {
                                        opacity: 1,
                                        scale: 1,
                                    } : {
                                        opacity: 0,
                                        scale: 0
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20,
                                    }}
                                    whileHover={{ scale: 1.08 }}
                                    onMouseEnter={() => setHoveredProduct(product.id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Extract base ID by removing suffix
                                        const baseId = product.id.replace(/_\d+$/, "");
                                        onProductSelect(products.find(p => p.id === baseId)!);
                                    }}
                                >
                                    {/* Product Image */}
                                    <div className="w-full h-full relative cursor-pointer">
                                        {/* Shadow */}
                                        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[10%] bg-black/20 blur-md rounded-full" />
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain relative z-10 drop-shadow-sm transition-transform duration-300"
                                            draggable={false}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Hover tooltip */}
                    <AnimatePresence>
                        {hoveredProduct && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="fixed pointer-events-none bg-foreground text-background px-3 py-1.5 rounded-full text-sm font-medium z-50"
                                style={{
                                    left: mousePos.x + 15,
                                    top: mousePos.y + 15,
                                }}
                            >
                                + {extendedProducts.find(p => p.id === hoveredProduct)?.name}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between pointer-events-none">
                <h1 className="text-xl font-medium tracking-tight pointer-events-auto">showcase</h1>

                {/* View Toggle */}
                <div className="pointer-events-auto">
                    <button
                        onClick={onViewChange}
                        className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-border text-sm hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="3" cy="3" r="1.5" />
                            <circle cx="8" cy="3" r="1.5" />
                            <circle cx="13" cy="3" r="1.5" />
                            <circle cx="3" cy="8" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="13" cy="8" r="1.5" />
                            <circle cx="3" cy="13" r="1.5" />
                            <circle cx="8" cy="13" r="1.5" />
                            <circle cx="13" cy="13" r="1.5" />
                        </svg>
                        <span className="group-hover:hidden">体験ビュー</span>
                        <span className="hidden group-hover:inline">一覧ビューへ</span>
                    </button>
                </div>
            </header>

            {/* Zoom controls */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
                <button
                    onClick={zoomIn}
                    disabled={scale >= 2}
                    className={`w-10 h-10 backdrop-blur-sm rounded-lg border border-border flex items-center justify-center transition-colors ${scale >= 2
                            ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                            : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <button
                    onClick={zoomOut}
                    disabled={scale <= minScale}
                    className={`w-10 h-10 backdrop-blur-sm rounded-lg border border-border flex items-center justify-center transition-colors ${scale <= minScale
                            ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                            : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
            </div>

            {/* Drag hint */}
            <div className="fixed bottom-6 right-24 z-40 flex items-center gap-2 text-muted text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                ドラッグして探索
            </div>


        </div>
    );
}
