import { createRoot } from 'react-dom/client'
import './index.css'
import { UI } from './UI/UI'

createRoot(document.getElementById('ui')!).render(<UI />)