import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product, ProductVariant } from '@/components/types';

interface ProductFormProps {
  product?: Product | null;
  variants?: ProductVariant[];
  onSave: (product: Product, variants: ProductVariant[]) => void;
  onCancel: () => void;

}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS  = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink'];

const ProductForm: React.FC<ProductFormProps> = ({ product, variants = [], onSave, onCancel }) => {
  const [formProduct, setFormProduct] = useState<Product>({
    id: product?.id,
    name: product?.name ?? '',
    category: product?.category ?? '',
    image: product?.image ?? '',
    featured: product?.featured ?? false,
    rating: product?.rating ?? 0,
    reviews: product?.reviews ?? 0,
    source_place: (product as any)?.source_place ?? '',
    vendor: (product as any)?.vendor ?? ''
  });


  // selected sizes/colors (strings arrays)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // store stock and pricing per variant keyed by `${size}-${color}`
  const [variantStocks, setVariantStocks] = useState<Record<string, number>>({});
  const [variantPricing, setVariantPricing] = useState<Record<string, { original_price: number; discount: number }>>({});
  // optional mapping to preserve existing variant ids when editing
  const [variantIdMap, setVariantIdMap] = useState<Record<string, string>>({});

    useEffect(() => {
    if (variants && variants.length > 0) {
      const sizes = Array.from(new Set(variants.map(v => v.size)));
      const colors = Array.from(new Set(variants.map(v => v.color)));
      setSelectedSizes(sizes);
      setSelectedColors(colors);

    const stocks: Record<string, number> = {};
    const pricing: Record<string, { original_price: number; discount: number }> = {};
    const idMap: Record<string, string> = {};
      
      for (const v of variants) {
        const key = `${v.size}-${v.color}`;
        stocks[key] = v.stock ?? 0;
        pricing[key] = { original_price: v.original_price ?? 0, discount: v.discount ?? 0 };
        if (v.id) idMap[key] = v.id;
      }
      setVariantStocks(stocks);
      setVariantPricing(pricing);
      setVariantIdMap(idMap);
    }
  }, [variants]);


  const toggleSize = (s: string) => {
    setSelectedSizes(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };
  const toggleColor = (c: string) => {
    setSelectedColors(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));
  };

    const setStockFor = (key: string, value: number) => {
    setVariantStocks(prev => ({ ...prev, [key]: value }));
  };

  const setPricingFor = (key: string, original_price: number, discount: number) => {
    setVariantPricing(prev => ({ ...prev, [key]: { original_price, discount } }));
  };

  // computed price helper
  const computePrice = (original_price: number, discount: number) => {
    const p = original_price - (original_price * (discount / 100));
    return Math.round(p * 100) / 100;
  };



  //   const handleStockChange = (key: string, value: number) => {
  //   setVariantStocks({ ...variantStocks, [key]: value });
  // };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

        // Basic product payload (don't set id when creating — let DB generate if desired)
    const productPayload: Product = {
      ...formProduct,
      id: formProduct.id, // may be undefined for new product
    };
    
    // generate variant objects
    const generatedVariants: ProductVariant[] = [];
    for (const size of selectedSizes) {
      for (const color of selectedColors) {
        const key = `${size}-${color}`;
        const original_price = variantPricing[key]?.original_price ?? 0;
        const discount = variantPricing[key]?.discount ?? 0;
        const price = computePrice(original_price, discount);
        const stock = variantStocks[key] ?? 0;

        generatedVariants.push({
          id: variantIdMap[key], // may be undefined for new variant
          product_id: productPayload.id, // may be undefined now; page handler will set product_id after insert
          size,
          color,
          stock,
          original_price,
          discount,
          price,
        });
      }
    }

    onSave(productPayload, generatedVariants);
  };
  
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const productData = {
  //     ...formData,
  //     id: product?.id || Date.now(),
  //     price: Number(formData.price),
  //     original_price: Number(formData.originalPrice),
  //     stock: Number(formData.stock),
  //     rating: Number(formData.rating),
  //     reviews: Number(formData.reviews),
  //     sizes: formData.sizes.split(',').map((s: string) => s.trim()),
  //     colors: formData.colors.split(',').map((c: string) => c.trim())
  //   };
  //   onSave(productData);
  // };
  
  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    //   <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
    //   <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
    //     <div className="p-6">
    //       <div className="flex items-center justify-between mb-6">
    //         <h2 className="text-xl font-semibold">
    //           {product ? 'Edit Product' : 'Add New Product'}
    //         </h2>
    //         <button onClick={onCancel}>
    //           <X className="h-6 w-6" />
    //         </button>
    //       </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{product ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={onCancel} className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* PRODUCT LEVEL */}
               <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={formProduct.name}
            onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
            required
          />
        </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formProduct.category}
                  onChange={(e) => setFormProduct({ ...formProduct, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Dresses">Dresses</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Ethnic Wear">Ethnic Wear</option>
                  <option value="Western Wear">Western Wear</option>
                </select>
              </div>

              <div>
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={(formProduct as any).vendor ?? ''}
              onChange={(e) => setFormProduct({ ...(formProduct as any), vendor: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Source Place</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={(formProduct as any).source_place ?? ''}
              onChange={(e) => setFormProduct({ ...(formProduct as any), source_place: e.target.value })}
            />
          </div>

                    <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={formProduct.image ?? ''}
              onChange={(e) => setFormProduct({ ...formProduct, image: e.target.value })}
            />
          </div>

              </div>

              {/* SELECT SIZES */}
        <div>
          <p className="font-semibold mb-2">Select Sizes</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-3 py-1 rounded border ${selectedSizes.includes(s) ? 'bg-purple-600 text-white' : 'bg-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

                {/* SELECT COLORS */}
        <div>
          <p className="font-semibold mb-2">Select Colors</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggleColor(c)}
                className={`px-3 py-1 rounded border ${selectedColors.includes(c) ? 'bg-purple-600 text-white' : 'bg-white'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

  {/* VARIANT GRID (stock/pricing per size-color) */}
        {selectedSizes.length > 0 && selectedColors.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Variant inventory & pricing</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {selectedSizes.map((size) =>
                selectedColors.map((color) => {
                  const key = `${size}-${color}`;
                  const pricing = variantPricing[key] ?? { original_price: 0, discount: 0 };
                  const stock = variantStocks[key] ?? 0;
                  const computedPrice = computePrice(pricing.original_price, pricing.discount);

                  return (
                    <div key={key} className="flex gap-3 items-center">
                      <div className="w-40">{size} / {color}</div>

                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={pricing.original_price}
                          onChange={(e) => setPricingFor(key, Number(e.target.value), pricing.discount)}
                          className="w-28 border px-2 py-1 rounded"
                          placeholder="Original"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step="0.01"
                          value={pricing.discount}
                          onChange={(e) => setPricingFor(key, pricing.original_price, Number(e.target.value))}
                          className="w-20 border px-2 py-1 rounded"
                          placeholder="%"
                        />
                        <input
                          type="number"
                          value={computedPrice}
                          readOnly
                          className="w-28 bg-gray-100 px-2 py-1 rounded"
                        />
                        <input
                          type="number"
                          min={0}
                          value={stock}
                          onChange={(e) => setStockFor(key, Number(e.target.value))}
                          className="w-20 border px-2 py-1 rounded"
                          placeholder="Stock"
                        />
                        {/* hidden: existing variant id if editing */}
                        <input type="hidden" value={variantIdMap[key] ?? ''} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {product ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
  );
};

export default ProductForm;