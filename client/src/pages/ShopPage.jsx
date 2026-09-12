import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { ShopItemCard } from '../components/shop/ShopItemCard';
import { Skeleton } from '../components/ui/Skeleton';

export const ShopPage = () => {
  const { user, updateUserData } = useAuth();
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Fetch shop items
  const { data: shopData, isLoading } = useQuery({
    queryKey: ['shop', categoryFilter],
    queryFn: async () => {
      const url = categoryFilter ? `/shop/items?category=${categoryFilter}` : '/shop/items';
      const res = await api.get(url);
      return res.data;
    },
  });

  const shopItems = shopData?.items || [];

  // Check which items are owned and equipped
  const inventory = user?.inventory || [];
  const ownedItemIds = new Set(
    inventory.map((inv) => (inv.itemId?._id || inv.itemId)?.toString())
  );
  const equippedItemIds = new Set(
    inventory
      .filter((inv) => inv.equipped)
      .map((inv) => (inv.itemId?._id || inv.itemId)?.toString())
  );

  // Purchase Item Mutation
  const purchaseMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await api.post(`/shop/purchase/${itemId}`);
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: data.message.toUpperCase() });
      if (data.user) {
        updateUserData(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: (err.response?.data?.message || 'TRANSACTION REJECTED: INSUFFICIENT CLEARANCE').toUpperCase(),
      });
    },
  });

  // Equip Item Mutation
  const equipMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await api.patch('/users/me', { equipItemId: itemId });
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: 'ASSET MOUNTED IN COMMAND DECK.' });
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: (err.response?.data?.message || 'FAILED TO MOUNT ASSET').toUpperCase(),
      });
    },
  });

  // Unequip Item Mutation
  const unequipMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await api.patch('/users/me', { unequipItemId: itemId });
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ type: 'success', message: 'ASSET RETURNED TO TACTICAL STORAGE.' });
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: (err.response?.data?.message || 'FAILED TO DEMOUNT ASSET').toUpperCase(),
      });
    },
  });

  const categories = [
    { id: '', label: 'ALL ASSETS' },
    { id: 'plant', label: 'BIO-SPECIMENS' },
    { id: 'lamp', label: 'LIGHTING ARRAYS' },
    { id: 'poster', label: 'GRAPHIC SCHEMATICS' },
    { id: 'rug', label: 'DECK FLOORING' },
    { id: 'mug', label: 'RATIONS & CONTAINERS' },
    { id: 'wallpaper', label: 'BULKHEAD WALLPAPERS' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#FAF3E8] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-block bg-[#141414] text-white text-[11px] font-mono font-bold px-2 py-0.5 mb-2">
            // REQUISITION TERMINAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141414] font-space tracking-tight uppercase">
            THE VAULT
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#141414]/70 mt-1 uppercase tracking-wider">
            EXCHANGE SURPLUS GOLD FOR TACTICAL DECOR, TERMINAL HARDWARE, AND ROOM ASSETS.
          </p>
        </div>

        {/* Currency Display */}
        <div className="bg-[#F2B705] border-3 border-[#141414] p-4 shadow-brutal flex items-center gap-4 self-start md:self-auto min-w-[220px]">
          <div className="w-10 h-10 bg-[#141414] flex items-center justify-center text-[#F2B705] font-extrabold text-lg">
            $
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#141414]">
              REQUISITION RESERVE
            </div>
            <div className="text-2xl font-extrabold font-space text-[#141414]">
              {user?.cozyCoins || 0} <span className="text-xs font-black">GOLD</span>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 border-3 border-[#141414] shadow-brutal text-xs font-mono font-bold flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-[#2B4AE8] text-white'
              : 'bg-[#E8402C] text-white'
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

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-[#141414]/20">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-none cursor-pointer border-2 border-[#141414] ${
                isSelected
                  ? 'bg-[#141414] text-[#F5F3EF] shadow-brutal'
                  : 'bg-[#F5F3EF] text-[#141414] hover:bg-[#FAF3E8]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Shop Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#FAF3E8] border-3 border-[#141414] p-5 space-y-4">
              <Skeleton width="w-24" height="h-5" />
              <Skeleton width="w-full" height="h-32" />
              <Skeleton width="w-3/4" height="h-6" />
              <Skeleton width="w-full" height="h-10" />
            </div>
          ))}
        </div>
      ) : shopItems.length === 0 ? (
        <div className="bg-[#FAF3E8] border-3 border-[#141414] p-12 text-center shadow-brutal">
          <div className="text-4xl font-space font-extrabold text-[#141414] mb-2">[ 00 ]</div>
          <h3 className="text-lg font-extrabold font-space text-[#141414] uppercase">
            ZERO ASSETS FOUND IN SECTOR
          </h3>
          <p className="text-xs font-mono text-[#141414]/70 mt-1 uppercase">
            REVISE CATEGORY FILTER OR STAND BY FOR QUARTERMASTER RESTOCK.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shopItems.map((item) => {
            const isOwned = ownedItemIds.has(item._id.toString());
            const isEquipped = equippedItemIds.has(item._id.toString());

            return (
              <ShopItemCard
                key={item._id}
                item={item}
                userLevel={user?.level || 1}
                userCoins={user?.cozyCoins || 0}
                isOwned={isOwned}
                isEquipped={isEquipped}
                onPurchase={(id) => purchaseMutation.mutate(id)}
                onEquip={(id) => equipMutation.mutate(id)}
                onUnequip={(id) => unequipMutation.mutate(id)}
                isProcessing={
                  purchaseMutation.isPending ||
                  equipMutation.isPending ||
                  unequipMutation.isPending
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
