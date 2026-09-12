import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  Users,
  ScrollText,
  Store,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
  Coins,
  Search,
  Sliders,
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
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'plant',
    cost: 50,
    unlockLevel: 1,
    imageKey: 'plant_succulent',
  });

  // Bulk actions state
  const [goldBonusAmount, setGoldBonusAmount] = useState(100);
  const [notification, setNotification] = useState(null);

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

  const createItemMutation = useMutation({
    mutationFn: async (itemData) => {
      const res = await api.post('/admin/shop', itemData);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      setIsAddItemOpen(false);
      setNewItem({
        name: '',
        description: '',
        category: 'plant',
        cost: 50,
        unlockLevel: 1,
        imageKey: 'plant_succulent',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (err) => {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Creation failed' });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/admin/shop/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/admin/shop/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });

  const reseedShopMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/admin/system/seed');
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin', 'shop'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
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
          { id: 'shop', label: `04 THE VAULT (${shopData?.length || 0})`, icon: Store },
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

                <button
                  onClick={() => {
                    if (window.confirm('Re-seed the Vault catalog with 21 standard Bauhaus items?')) {
                      reseedShopMutation.mutate();
                    }
                  }}
                  disabled={reseedShopMutation.isPending}
                  className="w-full py-3 bg-[#2B4AE8] hover:bg-[#141414] text-white border-2 border-[#141414] text-xs font-mono font-black uppercase text-left px-4 flex items-center justify-between cursor-pointer"
                >
                  <span>[MACRO 02] RE-SEED CATALOG WITH 21 DEFAULT ASSETS</span>
                  <Store className="w-4 h-4" />
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
                        <button
                          onClick={() => {
                            if (window.confirm(`Purge agent ${u.username} and all associated records?`)) {
                              deleteUserMutation.mutate(u._id);
                            }
                          }}
                          className="px-2.5 py-1 bg-[#E8402C] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer hover:bg-[#141414]"
                        >
                          PURGE
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
                      <button
                        onClick={() => {
                          if (window.confirm('Terminate this directive?')) {
                            deleteQuestMutation.mutate(q._id);
                          }
                        }}
                        className="px-2.5 py-1 bg-[#E8402C] text-white border border-[#141414] text-[10px] font-black uppercase cursor-pointer"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: THE VAULT CATALOG
         ------------------------------------------------------------- */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-space uppercase text-[#141414]">
              CATALOGED VAULT HARDWARE ({shopData?.length || 0})
            </h2>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E8402C] text-white border-2 border-[#141414] font-mono text-xs font-black uppercase cursor-pointer shadow-brutal-sm hover:bg-[#141414]"
            >
              <Plus className="w-4 h-4" /> CATALOG NEW ASSET
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(shopData || []).map((item) => (
              <div
                key={item._id}
                className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#141414]/60">
                      [{item.category}]
                    </span>
                    <span className="px-2 py-0.5 bg-[#F2B705] text-[#141414] border border-[#141414] text-[10px] font-black font-mono">
                      {item.cost} GOLD
                    </span>
                  </div>

                  <h3 className="font-black font-space text-sm text-[#141414] uppercase">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-[#141414]/70 mt-1 mb-3">
                    {item.description}
                  </p>
                  <div className="text-[10px] font-mono font-bold text-[#141414]/60">
                    REQUIRED CLEARANCE: LV.{item.unlockLevel}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-[#141414]/20 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 py-1.5 bg-[#2B4AE8] text-white border border-[#141414] text-[10px] font-mono font-black uppercase cursor-pointer"
                  >
                    REVISE
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Decommission asset ${item.name}?`)) {
                        deleteItemMutation.mutate(item._id);
                      }
                    }}
                    className="px-2 py-1.5 bg-[#E8402C] text-white border border-[#141414] text-[10px] font-mono font-black uppercase cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
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

          <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal space-y-4">
            <div className="text-xs font-mono font-bold text-[#2B4AE8]">// CATALOG RESET</div>
            <h2 className="text-2xl font-black font-space text-[#141414] uppercase">
              RE-SEED DEFAULT SHOP INVENTORY
            </h2>
            <p className="text-xs font-mono text-[#141414]/70">
              Restores all 21 original plants, desk lamps, and poster items to The Vault.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset catalog to 21 factory default items?')) {
                  reseedShopMutation.mutate();
                }
              }}
              disabled={reseedShopMutation.isPending}
              className="px-6 py-3 bg-[#2B4AE8] text-white border-2 border-[#141414] font-mono text-xs font-black uppercase cursor-pointer"
            >
              TRIGGER FACTORY RE-SEED →
            </button>
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

      {/* -------------------------------------------------------------
          MODAL: ADD NEW VAULT ASSET
         ------------------------------------------------------------- */}
      {isAddItemOpen && (
        <Modal
          isOpen={isAddItemOpen}
          onClose={() => setIsAddItemOpen(false)}
          title="CATALOG NEW VAULT ASSET"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createItemMutation.mutate(newItem);
            }}
            className="space-y-4 font-mono"
          >
            <Input
              label="ASSET NAME"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="e.g. MONOCHROME DESK LAMP"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-[#141414]">CATEGORY</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F5F3EF] border-2 border-[#141414] text-xs font-mono font-bold uppercase"
              >
                <option value="plant">BIO-SPECIMENS (PLANT)</option>
                <option value="lamp">LIGHTING ARRAY (LAMP)</option>
                <option value="poster">SCHEMATIC PRINT (POSTER)</option>
                <option value="rug">DECK FLOORING (RUG)</option>
                <option value="mug">RATION MUG (MUG)</option>
                <option value="wallpaper">BULKHEAD WALLPAPER (WALLPAPER)</option>
              </select>
            </div>
            <Input
              label="GOLD COST"
              type="number"
              value={newItem.cost}
              onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
              required
            />
            <Input
              label="REQUIRED UNLOCK LEVEL"
              type="number"
              value={newItem.unlockLevel}
              onChange={(e) => setNewItem({ ...newItem, unlockLevel: Number(e.target.value) })}
              required
            />
            <Input
              label="IMAGE KEY / ASSET IDENTIFIER"
              value={newItem.imageKey}
              onChange={(e) => setNewItem({ ...newItem, imageKey: e.target.value })}
              placeholder="e.g. plant_bonsai"
              required
            />
            <Textarea
              label="SPECIFICATION DESCRIPTION"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={2}
              required
            />

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsAddItemOpen(false)}>
                CANCEL
              </Button>
              <Button type="submit" variant="primary">
                COMMIT ASSET TO VAULT
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          MODAL: REVISE VAULT ASSET
         ------------------------------------------------------------- */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title={`REVISE ASSET: ${editingItem.name}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateItemMutation.mutate({
                id: editingItem._id,
                data: {
                  name: formData.get('name'),
                  cost: Number(formData.get('cost')),
                  unlockLevel: Number(formData.get('unlockLevel')),
                  description: formData.get('description'),
                },
              });
            }}
            className="space-y-4 font-mono"
          >
            <Input
              label="ASSET NAME"
              name="name"
              defaultValue={editingItem.name}
              required
            />
            <Input
              label="GOLD COST"
              name="cost"
              type="number"
              defaultValue={editingItem.cost}
              required
            />
            <Input
              label="UNLOCK LEVEL"
              name="unlockLevel"
              type="number"
              defaultValue={editingItem.unlockLevel}
              required
            />
            <Textarea
              label="DESCRIPTION"
              name="description"
              defaultValue={editingItem.description}
              rows={2}
              required
            />

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                CANCEL
              </Button>
              <Button type="submit" variant="primary">
                UPDATE ASSET
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
