import './index.css'
import { useState, useMemo } from 'react'
import { useInventory } from './useInventory'
import type { Product } from './types'
import ProductForm from './components/ProductForm'
import { Plus, Package, AlertTriangle, Search, Edit2, Trash2, TrendingUp, DollarSign } from 'lucide-react'

export default function App() {
  const { products, add, update, remove } = useInventory()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products])
  const lowStock = products.filter(p => p.stock <= p.minStock)
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (catFilter === 'all' || p.category === catFilter) &&
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  })

  function handleSubmit(data: Omit<Product, 'id' | 'createdAt'>) {
    if (editing) update(editing.id, data)
    else add(data)
    setShowForm(false); setEditing(null)
  }

  const stockColor = (p: Product) =>
    p.stock === 0 ? 'text-red-400' : p.stock <= p.minStock ? 'text-yellow-400' : 'text-green-400'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Inventory Dashboard</h1>
              <p className="text-slate-400 text-xs mt-0.5">{products.length} productos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lowStock.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 text-xs font-medium">
                <AlertTriangle size={13} />
                {lowStock.length} stock bajo
              </div>
            )}
            <button onClick={() => { setEditing(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors">
              <Plus size={16} /> Nuevo producto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Package, label: 'Total productos', value: products.length, color: 'purple' },
            { icon: AlertTriangle, label: 'Stock bajo', value: lowStock.length, color: 'yellow' },
            { icon: TrendingUp, label: 'Sin stock', value: products.filter(p => p.stock === 0).length, color: 'red' },
            { icon: DollarSign, label: 'Valor total', value: `$${totalValue.toLocaleString()}`, color: 'green' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                { purple: 'bg-purple-600/20 text-purple-400', yellow: 'bg-yellow-600/20 text-yellow-400',
                  red: 'bg-red-600/20 text-red-400', green: 'bg-green-600/20 text-green-400' }[color]
              }`}>
                <Icon size={16} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${catFilter === c ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {c === 'all' ? 'Todos' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  {['Producto', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">${p.price.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm font-bold ${stockColor(p)}`}>{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        p.stock === 0 ? 'bg-red-600/20 text-red-400 border-red-600/30' :
                        p.stock <= p.minStock ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' :
                        'bg-green-600/20 text-green-400 border-green-600/30'
                      }`}>
                        {p.stock === 0 ? 'Sin stock' : p.stock <= p.minStock ? 'Stock bajo' : 'OK'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing(p); setShowForm(true) }}
                          className="text-slate-400 hover:text-white transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => { if (confirm('¿Eliminar?')) remove(p.id) }}
                          className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                <Package size={32} className="mx-auto mb-3 opacity-30" />
                Sin productos. Agrega uno nuevo.
              </div>
            )}
          </div>
        </div>
      </main>

      {showForm && <ProductForm product={editing} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null) }} />}
    </div>
  )
}
