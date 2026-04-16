/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  History, 
  ShieldCheck, 
  Mail, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  ChevronRight, 
  Copy, 
  RefreshCw,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Zap,
  Lock,
  Globe,
  User,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Tab = 'dashboard' | 'settings' | 'logs' | 'license';
type MailProvider = 'gmail' | 'smtp';

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed';
  timestamp: string;
  provider: MailProvider;
}

// --- Mock Data ---

const MOCK_LOGS: EmailLog[] = [
  { id: '1', to: 'user@example.com', subject: 'Welcome to our platform!', status: 'sent', timestamp: '2024-03-15 10:30:00', provider: 'gmail' },
  { id: '2', to: 'admin@test.com', subject: 'New order received #1234', status: 'sent', timestamp: '2024-03-15 11:15:00', provider: 'gmail' },
  { id: '3', to: 'customer@shop.net', subject: 'Password reset request', status: 'failed', timestamp: '2024-03-15 12:05:00', provider: 'gmail' },
  { id: '4', to: 'support@help.com', subject: 'Ticket #998 updated', status: 'sent', timestamp: '2024-03-15 14:20:00', provider: 'gmail' },
  { id: '5', to: 'dev@code.io', subject: 'Deployment successful', status: 'sent', timestamp: '2024-03-15 15:45:00', provider: 'gmail' },
];

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`sidebar-nav-item w-full ${active ? 'active' : ''}`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span>{label}</span>
  </button>
);

const StatusBadge = ({ authenticated }: { authenticated: boolean }) => (
  <div className="status-pill">
    <div className="status-dot" />
    {authenticated ? 'Authenticated' : 'Not Authenticated'}
  </div>
);

const NoticeBox = ({ type, title, children, onClose }: { type: 'review' | 'donate', title: string, children: React.ReactNode, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="notice-card mb-8"
  >
    <div className="notice-content">
      <h4 className="font-bold text-accent text-sm uppercase tracking-wider">{title}</h4>
      <div className="text-slate-400 text-xs mt-1">
        {children}
      </div>
    </div>
    <div className="flex gap-3">
      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Lifetime</span>
      <button 
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mailProvider, setMailProvider] = useState<MailProvider>('gmail');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showNotice, setShowNotice] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTest = () => {
    if (!testEmail) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setTestResult({ success: true, message: 'Test email sent successfully!' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-main flex font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-sidebar-bg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-sidebar-bg font-black text-lg">
              L
            </div>
            <h1 className="font-extrabold text-lg text-white tracking-tight">Lunexia SMTP</h1>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarItem 
              icon={Settings} 
              label="General Settings" 
              active={activeTab === 'settings' || activeTab === 'dashboard'} 
              onClick={() => setActiveTab('settings')} 
            />
            <SidebarItem 
              icon={History} 
              label="Email Logs" 
              active={activeTab === 'logs'} 
              onClick={() => setActiveTab('logs')} 
            />
            <SidebarItem 
              icon={Zap} 
              label="Integrations" 
              active={false} 
              onClick={() => {}} 
            />
            <SidebarItem 
              icon={ShieldCheck} 
              label="License Control" 
              active={activeTab === 'license'} 
              onClick={() => setActiveTab('license')} 
            />
            <SidebarItem 
              icon={Globe} 
              label="Documentation" 
              active={false} 
              onClick={() => {}} 
            />
          </nav>

          <div className="mt-auto pt-6 text-[11px] text-white/30 font-medium">
            v1.0.0 Pro Edition
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="px-8 pt-8 pb-0 flex items-center justify-between sticky top-0 z-40 bg-bg-main/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-bg">Configuration</h1>
              <p className="text-text-secondary text-sm mt-0.5">Configure how your WordPress site handles outgoing emails.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusBadge authenticated={isAuthenticated} />
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-full mx-auto">
            
            <AnimatePresence>
              {showNotice && (
                <NoticeBox 
                  type="review" 
                  title="Pro License Active" 
                  onClose={() => setShowNotice(false)}
                >
                  <p>You have access to priority delivery and real-time logging.</p>
                </NoticeBox>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {(activeTab === 'dashboard' || activeTab === 'settings') && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
                >
                  {/* Left Column: Provider Settings */}
                  <div className="card-base">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-sidebar-bg">Provider Settings</h3>
                    </div>

                    <div className="tab-group mb-8">
                      <button 
                        onClick={() => setMailProvider('gmail')}
                        className={`tab-item ${mailProvider === 'gmail' ? 'active' : ''}`}
                      >
                        Gmail OAuth2
                      </button>
                      <button 
                        onClick={() => setMailProvider('smtp')}
                        className={`tab-item ${mailProvider === 'smtp' ? 'active' : ''}`}
                      >
                        Custom SMTP
                      </button>
                      <button className="tab-item">SendGrid</button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-text-secondary">Client ID</label>
                        <div className="key-display">
                          <span className="truncate mr-4">508050366421-ar...njq5rnib78.apps</span>
                          <button className="text-blue-600 text-xs font-bold hover:underline">Change</button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-text-secondary">Client Secret</label>
                        <div className="key-display">
                          <span>••••••••••••••••••••••••••••</span>
                          <button className="text-blue-600 text-xs font-bold hover:underline">Reveal</button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-text-secondary">From Email</label>
                        <input 
                          type="text" 
                          defaultValue="admin@lunexiait.com"
                          disabled
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-light rounded-lg text-sm text-text-primary opacity-60"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-text-secondary">Redirect URI</label>
                        <div className="key-display">
                          <span className="truncate mr-4">https://yoursite.com/wp-admin/</span>
                          <button className="text-blue-600 text-xs font-bold hover:underline">Copy</button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button className="btn-primary w-full">
                          Save Connection Settings
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Side Panels */}
                  <div className="space-y-6">
                    <div className="card-base">
                      <h3 className="font-bold text-sidebar-bg mb-5">Test Delivery</h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-semibold text-text-secondary">Recipient Email</label>
                          <input 
                            type="email" 
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="hello@example.com"
                            className="w-full px-4 py-2.5 bg-white border border-border-light rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <button 
                          onClick={handleSendTest}
                          disabled={isSending || !testEmail}
                          className="btn-secondary w-full flex items-center justify-center gap-2"
                        >
                          {isSending ? <RefreshCw size={16} className="animate-spin" /> : 'Send Test Email'}
                        </button>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Send a test email to verify your connection settings are working correctly.
                        </p>
                      </div>
                    </div>

                    <div className="card-base bg-bg-main border-dashed">
                      <h3 className="font-bold text-sidebar-bg mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] text-text-secondary">Sent Today</span>
                          <span className="font-bold text-sidebar-bg">1,242</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] text-text-secondary">Success Rate</span>
                          <span className="font-bold text-emerald-600">99.8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="card-base overflow-hidden p-0"
                >
                  <div className="p-6 border-b border-border-light flex items-center justify-between">
                    <h3 className="font-bold text-sidebar-bg">Email Logs</h3>
                    <div className="flex gap-2">
                      <button className="btn-secondary py-1.5 text-xs">Export CSV</button>
                      <button className="btn-secondary py-1.5 text-xs text-rose-600 border-rose-100 hover:bg-rose-50">Clear Logs</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Recipient</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light">
                        {MOCK_LOGS.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium">{log.to}</td>
                            <td className="px-6 py-4 text-sm text-text-secondary">{log.subject}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                log.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[11px] text-text-secondary font-mono">{log.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'license' && (
                <motion.div
                  key="license"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="card-base bg-sidebar-bg text-white p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">License Management</h2>
                    <p className="text-slate-400 text-sm mb-8">Enter your license key to unlock Pro features and priority support.</p>
                    
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-mono tracking-widest focus:ring-2 focus:ring-accent/20 outline-none text-center"
                      />
                      <button className="btn-primary w-full py-4">
                        Activate License
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>
    </div>
  );
}

