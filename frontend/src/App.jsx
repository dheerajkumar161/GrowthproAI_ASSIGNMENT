import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import { BusinessProvider } from './context/BusinessContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout/Layout'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BusinessProvider>
          <Helmet>
                          <title>Business SEO Dashboard</title>
            <meta name="description" content="Business SEO Dashboard with AI-powered headline generation and business suggestions." />
          </Helmet>
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BusinessProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App 