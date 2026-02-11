import React, { useEffect, useState } from 'react'
import { api } from '../service/api'

export const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/produtos')
      const data = response.data.data

      console.log('Produtos carregados:', data);
      
      setProducts(data)
    } catch (err) {
      console.error('Erro ao carregar os produtos:', err)
      setError('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <p>Carregando produtos...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Home</h1>

      {products.length === 0 && <p>Nenhum produto encontrado</p>}

      {products.map(p => (
        <div key={p.id}>
          {p.nome}
        </div>
      ))}
    </div>
  )
}