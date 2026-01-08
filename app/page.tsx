"use client";

import { useState } from "react";
import ExperienceCanvas from "./components/ExperienceCanvas";
import ListView from "./components/ListView";
import ProductDetailPanel from "./components/ProductDetailPanel";
import { Product } from "./data/products";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"experience" | "list">("experience");

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const toggleView = () => {
    setViewMode(viewMode === "experience" ? "list" : "experience");
  };

  return (
    <main className="relative">
      {viewMode === "experience" ? (
        <ExperienceCanvas
          onProductSelect={handleProductSelect}
          selectedProduct={selectedProduct}
          onCanvasClick={handleClosePanel}
          onViewChange={toggleView}
        />
      ) : (
        <ListView
          onProductSelect={handleProductSelect}
          onViewChange={toggleView}
        />
      )}

      <ProductDetailPanel
        product={selectedProduct}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </main>
  );
}
