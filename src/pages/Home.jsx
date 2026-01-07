import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const Home = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'produtos')
      const data = response.data.data
      setProducts(data)
      console.log('Produtos carregados', data)
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error)
      setError('Erro ao carregar os produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Home</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
