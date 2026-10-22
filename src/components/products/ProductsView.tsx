import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus 
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, toggleProductStock, showToast } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            Product Catalogue (Honey & Natural Foods)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock controls protect sales automation from committing out-of-stock items.
          </p>
        </div>

        <button
          onClick={() => showToast('Product added to catalogue')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 fill-white" />
          <span>Add SKU Item</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => {
          const isOutOfStock = product.stockStatus === 'Out of Stock';
          return (
            <div
              key={product.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-orange-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                    SKU: {product.sku}
                  </span>

                  {product.badge && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      product.badge === 'Sold Out'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 mt-2">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-snug">
                  {product.description}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-heading text-slate-900">
                    ₹{product.price}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    per {product.unit} (incl. 5% GST)
                  </span>
                </div>
              </div>

              {/* Bottom stock toggle */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Stock Status:</div>
                  <div className={`text-xs font-bold flex items-center gap-1.5 mt-0.5 ${
                    product.stockStatus === 'In Stock'
                      ? 'text-emerald-600'
                      : product.stockStatus === 'Low Stock'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {product.stockStatus === 'In Stock' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : product.stockStatus === 'Low Stock' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{product.stockStatus} ({product.stockQuantity} jars)</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleProductStock(product.id)}
                  className={`text-[11px] px-3.5 py-1.5 rounded-xl border font-bold transition-all ${
                    isOutOfStock
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
