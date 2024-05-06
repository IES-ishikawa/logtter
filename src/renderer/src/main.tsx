import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import { ErrorHandler, SettingInvoker, Theme, Viewer } from './features'
import { Layout } from './Layout'
import './main.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense>
      <SettingInvoker>
        <Theme>
          <ErrorHandler />
          <Layout>
            <Viewer />
          </Layout>
        </Theme>
      </SettingInvoker>
    </Suspense>
  </React.StrictMode>
)
