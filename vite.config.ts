import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O site é servido em https://xandgvaz.github.io/Portifolio/,
// então os assets precisam desse prefixo. Se o repositório for renomeado,
// atualize o `base` para o novo nome.
export default defineConfig({
  base: '/Portifolio/',
  plugins: [react()],
})
