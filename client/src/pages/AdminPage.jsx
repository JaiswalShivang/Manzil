import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  Users,
  ScrollText,
  Store,
  Activity,
  RefreshCw,
  Coins,
  Search,
  Sliders,
  UploadCloud,
  FileArchive,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const AdminPage = () => {
  const { user, login } = useAuth();
  const queryClient = useQueryClient();

  // Login Gate State (for unauthenticated or non-admin users)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Admin HUD Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'quests' | 'shop' | 'system'

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [questFilter, setQuestFilter] = useState('');

  // Modals State
  const [editingUser, setEditingUser] = useState(null);

  // Bulk actions state
  const [goldBonusAmount, setGoldBonusAmount] = useState(100);
  const [notification, setNotification] = useState(null);

  // Asset Zip Upload State
  const [selectedZip, setSelectedZip] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [itemRowEdits, setItemRowEdits] = useState({});

  // Inline confirmation tracking states
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
  const [confirmDeleteQuestId, setConfirmDeleteQuestId] = useState(null);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthenticating(true);
    const res = await login(adminEmail, adminPassword);
    setIsAuthenticating(false);
    if (!res.success) {
      setLoginError(res.message || 'Authentication failed');
    }
  };

  // Queries
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.stats;
    },
    enabled: isAdmin,
  });

  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.users;
    },
    enabled: isAdmin,
  });

  const { data: questsData, refetch: refetchQuests } = useQuery({
    queryKey: ['admin', 'quests', questFilter],
    queryFn: async () => {
      const url = questFilter ? `/admin/quests?status=${questFilter}` : '/admin/quests';
      const res = await api.get(url);
      return res.data.quests;
    },
    enabled: isAdmin,
  });

  const { data: shopData, refetch: refetchShop } = useQuery({
    queryKey: ['admin', 'shop'],
    queryFn: async () => {
      const res = await api.get('/admin/shop');
      return res.data.items;
    },
    enabled: isAdmin,
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/admin/users/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (err) => {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Update failed' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/users/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (err) => {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Purge failed' });
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/admin/quests/${id}/complete`);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });

  const deleteQuestMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/quests/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });

  const uploadZipMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUploadSummary(data);
      setSelectedZip(null);
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Archive upload failed',
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/admin/items/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/items/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
  });

  const grantAllMutation = useMutation({
    mutationFn: async (gold) => {
      const res = await api.post('/admin/system/grant-all', { goldBonus: gold });
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });

  const refreshAll = () => {
    refetchStats();
    refetchUsers();
    refetchQuests();
    refetchShop();
  };

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION GATEWAY (WHEN NOT LOGGED IN AS ADMIN)
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F5F3EF]">
        <div className="w-full max-w-lg bg-[#FAF3E8] border-3 border-[#141414] shadow-brutal-lg p-6 sm:p-10">
          <div className="bg-[#E8402C] text-white px-3 py-1 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-6 flex items-center justify-between border-b-3 border-[#141414]">
            <span className="text-[10px] font-mono font-black tracking-widest uppercase">
              // RESTRICTED CLEARANCE ONLY
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#141414] text-white px-2 py-0.5">
              ROOT_SECURITY
            </span>
          </div>

          <div className="mb-6">
            <div className="inline-block bg-[#141414] text-[#F2B705] text-[10px] font-mono font-black px-2 py-0.5 mb-2 uppercase">
              AUTHORIZATION GATEWAY
            </div>
            <h1 className="text-3xl font-black text-[#141414] font-space uppercase tracking-tight">
              ADMINISTRATIVE HUD
            </h1>
            <p className="text-xs font-mono font-bold text-[#141414]/70 mt-1 uppercase">
              ENTER ROOT OVERWATCH CREDENTIALS TO INITIALIZE FULL CONTROL INTERFACE.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-[#E8402C] border-2 border-[#141414] text-white font-mono text-xs font-bold uppercase shadow-brutal">
              // ERROR: {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <Input
              label="ADMINISTRATOR EMAIL"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />

            <Input
              label="ADMINISTRATOR PASSCODE"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full justify-center font-mono font-black uppercase text-sm mt-3 cursor-pointer"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? 'VERIFYING ROOT CLEARANCE...' : 'AUTHORIZE COMMAND DECK →'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-[#141414]/20 text-center">
            <span className="text-[11px] font-mono font-bold text-[#141414]/60 uppercase">
              // ROLE-BASED ACCESS CONTROL ENFORCED
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = (usersData || []).filter((u) => {
    if (!userSearch) return true;
    const term = userSearch.toLowerCase();
    return u.username?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Overwatch Admin Banner */}
      <div className="bg-[#141414] text-[#F5F3EF] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#E8402C] text-white text-[10px] font-mono font-black px-2 py-0.5 uppercase">
              ROOT CLEARANCE
            </span>
            <span className="text-[10px] font-mono font-bold text-[#F2B705]">
              // ALL PROTOCOLS UNLOCKED
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-space tracking-tight uppercase text-white">
            ADMINISTRATIVE COMMAND HUD
          </h1>
          <p className="text-xs font-mono text-[#F5F3EF]/70 mt-1 uppercase">
            OPERATIONAL OVERWATCH // AGENT PROFILES, QUEST VERIFICATIONS, VAULT CATALOG, AND ENGINE METRICS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF3E8] hover:bg-white text-[#141414] border-2 border-[#141414] font-mono font-black text-xs uppercase cursor-pointer transition-none shadow-brutal-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> REFRESH TELEMETRY
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 border-3 border-[#141414] shadow-brutal text-xs font-mono font-bold flex items-center justify-between ${
            notification.type === 'success' ? 'bg-[#2B4AE8] text-white' : 'bg-[#E8402C] text-white'
          }`}
        >
          <span>// STATUS: {notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="px-2 py-0.5 bg-[#141414] text-white cursor-pointer hover:bg-white hover:text-[#141414] transition-none"
          >
            DISMISS [X]
          </button>
        </div>
      )}

      {/* Admin Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-3 border-[#141414]">
        {[
          { id: 'overview', label: '01 OVERVIEW & TELEMETRY', icon: Activity },
          { id: 'users', label: `02 AGENTS (${usersData?.length || 0})`, icon: Users },
          { id: 'quests', label: `03 DIRECTIVES (${questsData?.length || 0})`, icon: ScrollText },
          { id: 'shop', label: `04 SPRITE CMS (${shopData?.length || 0})`, icon: Store },
          { id: 'system', label: '05 SYSTEM PROTOCOLS', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-black uppercase transition-none cursor-pointer border-2 border-[#141414] whitespace-nowrap ${
                isSelected
                  ? 'bg-[#E8402C] text-white shadow-brutal'
                  : 'bg-[#FAF3E8] text-[#141414] hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------
          TAB 1: OVERVIEW & TELEMETRY
         ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Graphic KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#2B4AE8] border-l-2 border-b-2 border-[#141414]" />
              <div className="text-xs font-mono font-bold text-[#141414]/60 uppercase">TOTAL AGENTS</div>
              <div className="text-4xl font-black font-space text-[#141414] mt-2">
                {statsData?.totalUsers || 0}
              </div>
              <div className="text-[11px] font-mono text-[#141414]/70 mt-2">
                AVG CLEARANCE: LV. {statsData?.avgLevel || 1}
              </div>
            </div>

            <div className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#E8402C] border-l-2 border-b-2 border-[#141414]" />
              <div className="text-xs font-mono font-bold text-[#141414]/60 uppercase">TOTAL DIRECTIVES</div>
              <div className="text-4xl font-black font-space text-[#141414] mt-2">
                {statsData?.totalQuests || 0}
              </div>
              <div className="text-[11px] font-mono text-[#141414]/70 mt-2">
                {statsData?.completedQuests || 0} COMPLETE / {statsData?.pendingQuests || 0} ACTIVE
              </div>
            </div>

            <div className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#F2B705] border-l-2 border-b-2 border-[#141414]" />
              <div className="text-xs font-mono font-bold text-[#141414]/60 uppercase">GOLD LIQUIDITY</div>
              <div className="text-4xl font-black font-space text-[#141414] mt-2">
                {statsData?.totalGold || 0}
              </div>
              <div className="text-[11px] font-mono text-[#141414]/70 mt-2">
                TOTAL CIRCULATING CREDITS
              </div>
            </div>

            <div className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#141414] border-l-2 border-b-2 border-[#141414]" />
              <div className="text-xs font-mono font-bold text-[#141414]/60 uppercase">VAULT ASSETS</div>
              <div className="text-4xl font-black font-space text-[#141414] mt-2">
                {statsData?.totalItems || 0}
              </div>
              <div className="text-[11px] font-mono text-[#141414]/70 mt-2">
                CATALOGED HARDWARE ITEMS
              </div>
            </div>
          </div>

          {/* Engine Telemetry & Quick Commands */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 shadow-brutal">
              <div className="text-xs font-mono font-bold text-[#2B4AE8] mb-1">// SERVER TELEMETRY</div>
              <h3 className="text-xl font-black font-space uppercase text-[#141414] mb-4">
                CORE SYSTEM METRICS
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-[#141414]/20">
                  <span className="font-bold text-[#141414]/70">MONGODB ATLAS STATUS:</span>
                  <span className="font-black text-[#2B4AE8]">
                    [{statsData?.dbState || 'CONNECTED'}]
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#141414]/20">
                  <span className="font-bold text-[#141414]/70">NODE RUNTIME:</span>
                  <span className="font-black text-[#141414]">{statsData?.nodeVersion || 'v20.x'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#141414]/20">
                  <span className="font-bold text-[#141414]/70">PROCESS UPTIME:</span>
                  <span className="font-black text-[#141414]">{statsData?.uptimeSeconds || 0}s</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#141414]/20">
                  <span className="font-bold text-[#141414]/70">TIMESTAMP:</span>
                  <span className="font-black text-[#141414]">{statsData?.serverTime || new Date().toISOString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 shadow-brutal">
              <div className="text-xs font-mono font-bold text-[#E8402C] mb-1">// RAPID COMMANDS</div>
              <h3 className="text-xl font-black font-space uppercase text-[#141414] mb-4">
                ADMINISTRATIVE MACROS
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => grantAllMutation.mutate(250)}
                  disabled={grantAllMutation.isPending}
                  className="w-full py-3 bg-[#F2B705] hover:bg-[#141414] text-[#141414] hover:text-white border-2 border-[#141414] text-xs font-mono font-black uppercase text-left px-4 flex items-center justify-between cursor-pointer"
                >
                  <span>[MACRO 01] GRANT +250 GOLD TO ALL REGISTERED AGENTS</span>
                  <Coins className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: AGENTS (USERS)
         ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
              <input
                type="text"
                placeholder="SEARCH AGENT BY CODENAME OR EMAIL..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF3E8] border-2 border-[#141414] text-xs font-mono font-bold text-[#141414] placeholder-[#141414]/40"
              />
            </div>
            <div className="text-xs font-mono font-bold text-[#141414]">
              TOTAL ACTIVE AGENTS: {filteredUsers.length}
            </div>
          </div>

          <div className="bg-[#FAF3E8] border-3 border-[#141414] shadow-brutal overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#141414] text-white border-b-2 border-[#141414]">
                  <th className="p-3 font-black">RANK</th>
                  <th className="p-3 font-black">CODENAME</th>
                  <th className="p-3 font-black">EMAIL</th>
                  <th className="p-3 font-black">RESERVE</th>
                  <th className="p-3 font-black">STREAK</th>
                  <th className="p-3 font-black">DIRECTIVES</th>
                  <th className="p-3 font-black">ROLE</th>
                  <th className="p-3 font-black text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#141414]/10">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white transition-none">
                    <td className="p-3 font-black font-space text-sm">LV.{u.level}</td>
                    <td className="p-3 font-black">{u.username}</td>
                    <td className="p-3 text-[#141414]/70">{u.email}</td>
                    <td className="p-3 font-bold text-[#855D16]">{u.cozyCoins} GOLD</td>
                    <td className="p-3 font-bold text-[#E8402C]">{u.streak?.count || 0}D</td>
                    <td className="p-3">{u.questCount || 0}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black border border-[#141414] ${
                          u.role === 'admin'
                            ? 'bg-[#E8402C] text-white'
                            : 'bg-[#FAF3E8] text-[#141414]'
                        }`}
                      >
                        {u.role ? u.role.toUpperCase() : 'USER'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="px-2.5 py-1 bg-[#2B4AE8] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer hover:bg-[#141414]"
                      >
                        EDIT
                      </button>
                      {u.role !== 'admin' && (
                        confirmDeleteUserId === u._id ? (
                          <div className="inline-flex items-center gap-1 bg-[#FAF3E8] border border-[#141414] p-1 shadow-brutal-sm">
                            <span className="text-[10px] font-mono font-black text-[#E8402C] px-1">PURGE?</span>
                            <button
                              onClick={() => {
                                setConfirmDeleteUserId(null);
                                deleteUserMutation.mutate(u._id);
                              }}
                              className="px-2 py-0.5 bg-[#E8402C] text-white text-[10px] font-mono font-black border border-[#141414] hover:bg-[#141414] cursor-pointer"
                              title="Confirm Purge"
                            >
                              CONFIRM
                            </button>
                            <button
                              onClick={() => setConfirmDeleteUserId(null)}
                              className="px-2 py-0.5 bg-white text-[#141414] text-[10px] font-mono font-black border border-[#141414] hover:bg-[#EBE7DF] cursor-pointer"
                              title="Cancel Purge"
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteUserId(u._id)}
                            className="px-2.5 py-1 bg-[#E8402C] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer hover:bg-[#141414]"
                          >
                            PURGE
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: DIRECTIVES (QUESTS)
         ------------------------------------------------------------- */}
      {activeTab === 'quests' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setQuestFilter(status)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 border-[#141414] cursor-pointer ${
                  questFilter === status
                    ? 'bg-[#141414] text-white shadow-brutal-sm'
                    : 'bg-[#FAF3E8] text-[#141414]'
                }`}
              >
                {status ? status : 'ALL DIRECTIVES'}
              </button>
            ))}
          </div>

          <div className="bg-[#FAF3E8] border-3 border-[#141414] shadow-brutal overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#141414] text-white border-b-2 border-[#141414]">
                  <th className="p-3 font-black">DIRECTIVE TITLE</th>
                  <th className="p-3 font-black">VECTOR</th>
                  <th className="p-3 font-black">REWARD</th>
                  <th className="p-3 font-black">AGENT</th>
                  <th className="p-3 font-black">STATUS</th>
                  <th className="p-3 font-black text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#141414]/10">
                {(questsData || []).map((q) => (
                  <tr key={q._id} className="hover:bg-white transition-none">
                    <td className="p-3 font-black">{q.title}</td>
                    <td className="p-3 uppercase">[{q.category}]</td>
                    <td className="p-3 font-bold">
                      +{q.xpReward} XP / +{q.coinReward} G
                    </td>
                    <td className="p-3 text-[#141414]/70">
                      {q.userId?.username || 'ANONYMOUS'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black border border-[#141414] ${
                          q.status === 'completed'
                            ? 'bg-[#2B4AE8] text-white'
                            : 'bg-[#F2B705] text-[#141414]'
                        }`}
                      >
                        {q.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {q.status !== 'completed' && (
                        <button
                          onClick={() => completeQuestMutation.mutate(q._id)}
                          className="px-2.5 py-1 bg-[#2B4AE8] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer"
                        >
                          FORCE VERIFY
                        </button>
                      )}
                      {confirmDeleteQuestId === q._id ? (
                        <div className="inline-flex items-center gap-1 bg-[#FAF3E8] border border-[#141414] p-1 shadow-brutal-sm">
                          <span className="text-[10px] font-mono font-black text-[#E8402C] px-1">TERMINATE?</span>
                          <button
                            onClick={() => {
                              setConfirmDeleteQuestId(null);
                              deleteQuestMutation.mutate(q._id);
                            }}
                            className="px-2 py-0.5 bg-[#E8402C] text-white text-[10px] font-mono font-black border border-[#141414] hover:bg-[#141414] cursor-pointer"
                            title="Confirm Terminate"
                          >
                            CONFIRM
                          </button>
                          <button
                            onClick={() => setConfirmDeleteQuestId(null)}
                            className="px-2 py-0.5 bg-white text-[#141414] text-[10px] font-mono font-black border border-[#141414] hover:bg-[#EBE7DF] cursor-pointer"
                            title="Cancel Terminate"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteQuestId(q._id)}
                          className="px-2.5 py-1 bg-[#E8402C] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer hover:bg-[#141414]"
                        >
                          DELETE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: PAPERDOLL AVATAR CMS & ZIP INGESTION
         ------------------------------------------------------------- */}
      {activeTab === 'shop' && (
        <div className="space-y-8">
          {/* Section 1: Drag & Drop / File Input Zip Upload Zone */}
          <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#2B4AE8] block uppercase">
                  // SPRITE ASSET INGESTION PIPELINE
                </span>
                <h2 className="text-2xl font-black font-space uppercase text-[#141414]">
                  BULK SPRITE ZIP UPLOAD (ADMIN CMS)
                </h2>
              </div>
              <span className="text-[11px] font-mono font-bold bg-[#141414] text-white px-2 py-1 uppercase">
                ZIP-SLIP PROTECTED
              </span>
            </div>

            <p className="text-xs font-mono text-[#141414]/70 uppercase">
              Upload any sprite archive (.zip) containing .webp or .png LPC sprite sheets. The server will validate path traversal, extract the 4-frame walk cycle into 256x64 .webp strips, and register items automatically.
            </p>

            <div className="border-3 border-dashed border-[#141414] bg-[#F5F3EF] p-8 text-center flex flex-col items-center justify-center space-y-4">
              <UploadCloud className="w-12 h-12 text-[#2B4AE8]" />
              <div>
                <label className="cursor-pointer px-4 py-2.5 bg-[#2B4AE8] hover:bg-[#141414] text-white border-2 border-[#141414] font-mono text-xs font-black uppercase inline-block shadow-brutal-sm">
                  <span>SELECT .ZIP ARCHIVE</span>
                  <input
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedZip(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {selectedZip && (
                  <div className="mt-2 text-xs font-mono font-bold text-[#141414] flex items-center justify-center gap-1.5">
                    <FileArchive className="w-4 h-4 text-[#E8402C]" />
                    <span>{selectedZip.name} ({(selectedZip.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {selectedZip && (
                <button
                  onClick={() => uploadZipMutation.mutate(selectedZip)}
                  disabled={uploadZipMutation.isPending}
                  className="px-6 py-2.5 bg-[#E8402C] hover:bg-[#141414] text-white border-2 border-[#141414] font-mono text-xs font-black uppercase cursor-pointer shadow-brutal-sm disabled:opacity-50"
                >
                  {uploadZipMutation.isPending ? 'EXTRACTING & CONVERTING SPRITES...' : 'UPLOAD & PROCESS ARCHIVE →'}
                </button>
              )}
            </div>

            {/* Upload Result Summary Banner */}
            {uploadSummary && (
              <div className="p-4 border-2 border-[#141414] bg-white shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-[#2B4AE8] uppercase">
                  <CheckCircle className="w-4 h-4" />
                  <span>IMPORT SUMMARY: {uploadSummary.imported} ITEMS CREATED / UPDATED</span>
                </div>

                {uploadSummary.skipped?.length > 0 && (
                  <div className="mt-2 text-[11px] font-mono space-y-1">
                    <div className="font-bold text-[#E8402C] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{uploadSummary.skipped.length} ENTRIES SKIPPED:</span>
                    </div>
                    <ul className="list-disc pl-5 text-[#141414]/70 space-y-0.5">
                      {uploadSummary.skipped.map((sk, idx) => (
                        <li key={idx}>
                          <span className="font-bold">{sk.filename}:</span> {sk.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Avatar Sprite Catalog Table with Inline Editing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-space uppercase text-[#141414]">
                REGISTERED AVATAR SPRITES ({shopData?.length || 0})
              </h2>
              <span className="text-xs font-mono text-[#141414]/60 uppercase">
                INLINE EDIT CLEARANCE LEVEL & GOLD COST PER ITEM
              </span>
            </div>

            <div className="bg-[#FAF3E8] border-3 border-[#141414] shadow-brutal overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#141414] text-white border-b-2 border-[#141414]">
                    <th className="p-3 font-black">SPRITE</th>
                    <th className="p-3 font-black">ASSET NAME</th>
                    <th className="p-3 font-black">SLOT</th>
                    <th className="p-3 font-black">REQ. LEVEL</th>
                    <th className="p-3 font-black">GOLD COST</th>
                    <th className="p-3 font-black">Z-INDEX</th>
                    <th className="p-3 font-black text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#141414]/10">
                  {(shopData || []).map((item) => {
                    const rowEdit = itemRowEdits[item._id] || {};
                    const curLevel = rowEdit.requiredLevel !== undefined ? rowEdit.requiredLevel : item.requiredLevel || item.unlockLevel || 1;
                    const curCost = rowEdit.goldCost !== undefined ? rowEdit.goldCost : item.goldCost !== undefined ? item.goldCost : item.cost || 0;
                    const curZ = rowEdit.zIndex !== undefined ? rowEdit.zIndex : item.zIndex || 2;
                    const curName = rowEdit.name !== undefined ? rowEdit.name : item.name;

                    const hasChanges =
                      rowEdit.requiredLevel !== undefined ||
                      rowEdit.goldCost !== undefined ||
                      rowEdit.zIndex !== undefined ||
                      rowEdit.name !== undefined;

                    return (
                      <tr key={item._id} className="hover:bg-white transition-none">
                        <td className="p-3">
                          <div className="w-12 h-12 bg-[#F5F3EF] border border-[#141414] flex items-center justify-center relative overflow-hidden">
                            {item.webpUrl ? (
                              <div
                                className="sprite-layer transform scale-75"
                                style={{ backgroundImage: `url('${item.webpUrl}')` }}
                              />
                            ) : (
                              <span className="text-xs">📦</span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 font-black">
                          <input
                            type="text"
                            value={curName}
                            onChange={(e) =>
                              setItemRowEdits((prev) => ({
                                ...prev,
                                [item._id]: { ...prev[item._id], name: e.target.value },
                              }))
                            }
                            className="w-44 px-2 py-1 bg-white border border-[#141414] text-xs font-mono font-bold"
                          />
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#141414] text-white">
                            {item.itemType || item.category || 'ITEM'}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span>LV.</span>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={curLevel}
                              onChange={(e) =>
                                setItemRowEdits((prev) => ({
                                  ...prev,
                                  [item._id]: {
                                    ...prev[item._id],
                                    requiredLevel: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-16 px-2 py-1 bg-white border border-[#141414] text-xs font-mono font-bold"
                            />
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              step="10"
                              value={curCost}
                              onChange={(e) =>
                                setItemRowEdits((prev) => ({
                                  ...prev,
                                  [item._id]: {
                                    ...prev[item._id],
                                    goldCost: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-20 px-2 py-1 bg-white border border-[#141414] text-xs font-mono font-bold"
                            />
                            <span>G</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={curZ}
                            onChange={(e) =>
                              setItemRowEdits((prev) => ({
                                ...prev,
                                [item._id]: {
                                  ...prev[item._id],
                                  zIndex: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-14 px-2 py-1 bg-white border border-[#141414] text-xs font-mono font-bold"
                          />
                        </td>

                        <td className="p-3 text-right space-x-2">
                          {hasChanges && (
                            <button
                              onClick={() => {
                                updateItemMutation.mutate({
                                  id: item._id,
                                  data: {
                                    name: curName,
                                    requiredLevel: curLevel,
                                    goldCost: curCost,
                                    zIndex: curZ,
                                  },
                                });
                                setItemRowEdits((prev) => {
                                  const next = { ...prev };
                                  delete next[item._id];
                                  return next;
                                });
                              }}
                              disabled={updateItemMutation.isPending}
                              className="px-2.5 py-1 bg-[#2B4AE8] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer hover:bg-[#141414]"
                            >
                              SAVE
                            </button>
                          )}
                          {confirmDeleteItemId === item._id ? (
                            <div className="inline-flex items-center gap-1 bg-[#FAF3E8] border border-[#141414] p-1 shadow-brutal-sm">
                              <span className="text-[10px] font-mono font-black text-[#E8402C] px-1">DECOMMISSION?</span>
                              <button
                                onClick={() => {
                                  setConfirmDeleteItemId(null);
                                  deleteItemMutation.mutate(item._id);
                                }}
                                disabled={deleteItemMutation.isPending}
                                className="px-2 py-0.5 bg-[#E8402C] text-white text-[10px] font-mono font-black border border-[#141414] hover:bg-[#141414] cursor-pointer"
                                title="Confirm Decommission"
                              >
                                CONFIRM
                              </button>
                              <button
                                onClick={() => setConfirmDeleteItemId(null)}
                                className="px-2 py-0.5 bg-white text-[#141414] text-[10px] font-mono font-black border border-[#141414] hover:bg-[#EBE7DF] cursor-pointer"
                                title="Cancel Decommission"
                              >
                                CANCEL
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteItemId(item._id)}
                              disabled={deleteItemMutation.isPending}
                              className="px-2.5 py-1 bg-[#E8402C] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer hover:bg-[#141414]"
                            >
                              DELETE
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: SYSTEM PROTOCOLS
         ------------------------------------------------------------- */}
      {activeTab === 'system' && (
        <div className="space-y-8">
          <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal space-y-6">
            <div className="text-xs font-mono font-bold text-[#E8402C]">// GLOBAL STIMULUS</div>
            <h2 className="text-2xl font-black font-space text-[#141414] uppercase">
              DISTRIBUTE GOLD TO ALL AGENTS
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md">
              <input
                type="number"
                min="10"
                step="50"
                value={goldBonusAmount}
                onChange={(e) => setGoldBonusAmount(Number(e.target.value))}
                className="px-4 py-2.5 bg-[#F5F3EF] border-2 border-[#141414] font-mono text-sm font-bold"
              />
              <button
                onClick={() => grantAllMutation.mutate(goldBonusAmount)}
                disabled={grantAllMutation.isPending}
                className="px-6 py-2.5 bg-[#F2B705] hover:bg-[#141414] text-[#141414] hover:text-white border-2 border-[#141414] font-mono text-xs font-black uppercase cursor-pointer"
              >
                EXECUTE +{goldBonusAmount} GOLD GRANT →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: EDIT AGENT ATTRIBUTES
         ------------------------------------------------------------- */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`REVISE AGENT: ${editingUser.username}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateUserMutation.mutate({
                id: editingUser._id,
                data: {
                  level: formData.get('level'),
                  cozyCoins: formData.get('cozyCoins'),
                  streakCount: formData.get('streakCount'),
                  role: formData.get('role'),
                },
              });
            }}
            className="space-y-4 font-mono"
          >
            <Input
              label="CLEARANCE LEVEL"
              name="level"
              type="number"
              defaultValue={editingUser.level}
              required
            />
            <Input
              label="GOLD BALANCE"
              name="cozyCoins"
              type="number"
              defaultValue={editingUser.cozyCoins}
              required
            />
            <Input
              label="STREAK DAYS"
              name="streakCount"
              type="number"
              defaultValue={editingUser.streak?.count || 0}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-[#141414]">ROLE CLEARANCE</label>
              <select
                name="role"
                defaultValue={editingUser.role || 'user'}
                className="w-full px-4 py-2.5 bg-[#F5F3EF] border-2 border-[#141414] text-xs font-mono font-bold uppercase"
              >
                <option value="user">USER (REGULAR AGENT)</option>
                <option value="admin">ADMIN (ROOT OVERWATCH)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                CANCEL
              </Button>
              <Button type="submit" variant="danger">
                SAVE PARAMETERS
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

