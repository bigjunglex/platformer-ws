import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UI } from './UI/index'
import initGame from './game/setup'

createRoot(document.getElementById('ui')!).render(
  <StrictMode>
    <UI />
  </StrictMode>,
)

initGame();