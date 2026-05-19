import { useState, useEffect } from 'react'
import type { Product } from './types'

const KEY = 'inventory_products'
const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

const DEMO: Product[] = [
  { id: id(), name: 'Laptop Dell XPS 15', category: 'Electrónica', price: 32000, stock: 5, minStock: 3, createdAt: new Date().toISOString() },
  { id: id(), name: 'Silla ergonómica', category: 'Mobiliario', price: 4500, stock: 2, minStock: 5, createdAt: new Date().toISOString() },
  { id: id(), name: 'Teclado mecánico', category: 'Accesorios', price: 1800, stock: 12, minStock: 4, createdAt: new Date().toISOString() },
  { id: id(), name: 'Monitor 27" 4K', category: 'Electrónica', price: 12000, stock: 1, minStock: 2, createdAt: new Date().toISOString() },
  { id: id(), name: 'Mouse inalámbrico', category: 'Accesorios', price: 650, stock: 20, minStock: 5, createdAt: new Date().toISOString() },
  { id: id(), name: 'Escritorio standing', category: 'Mobiliario', price: 8900, stock: 0, minStock: 2, createdAt: new Date().toISOString() },
]

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '') } catch { return DEMO }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(products)) }, [products])

  const add = (p: Omit<Product, 'id' | 'createdAt'>) =>
    setProducts(prev => [{ ...p, id: id(), createdAt: new Date().toISOString() }, ...prev])

  const update = (id: string, p: Partial<Product>) =>
    setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x))

  const remove = (id: string) =>
    setProducts(prev => prev.filter(x => x.id !== id))

  return { products, add, update, remove }
}
