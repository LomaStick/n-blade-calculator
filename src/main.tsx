import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</PersistGate>
		</Provider>
  </StrictMode>
)