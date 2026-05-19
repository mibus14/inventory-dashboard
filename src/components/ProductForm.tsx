import { useState } from 'react'
import type { Product } from '../types'
import { X, Save } from 'lucide-react'

interface Props {
  product?: Product | null
  onSubmit: (p: Omit<Product, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

const CATS = ['Electrónica', 'Accesorios', 'Mobiliario', 'Ropa', 'Alimentos', 'Otros']
const EMPTY = { name: '', category: 'Electrónica', price: 0, stock: 0, minStock: 5 }

export default function ProductForm({ product, onSubmit, onCancel }: Props) {
  const [f, setF] = useState(product
    ? { name: product.name, category: product.category, price: product.price, stock: product.stock, minStock: product.minStock }
    : EMPTY)

  const set = (k: string, v: string | number) => setF(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">{product ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button onClick={onCancel}><X size={20} className="text-slate-400 hover:text-white" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSubmit(f) }} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Nombre *</label>
            <input required value={f.name} onChange={e => set('name', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Categoría</label>
            <select value={f.category} onChange={e => set('category', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Precio ($)', 'price'], ['Stock', 'stock'], ['Stock mín.', 'minStock']].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs text-slate-400 font-medium block mb-1">{label}</label>
                <input type="number" min="0" value={(f as Record<string, number | string>)[key]}
                  onChange={e => set(key, Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">
              <Save size={14} /> {product ? 'Guardar' : 'Agregar'}
            </button>
            <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
