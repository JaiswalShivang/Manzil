import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { ShopItemCard } from '../components/shop/ShopItemCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Store, Coins, Sparkles, Filter } from 'lucide-react';

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
      setNotification({ type: 'success', message: data.message });
      if (data.user) {
        updateUserData(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['shop'] });
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Could not complete purchase',
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
      setNotification({ type: 'success', message: 'Item placed in your study room! 🪴' });
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Could not equip item',
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
      setNotification({ type: 'success', message: 'Item stored back in inventory.' });
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Could not unequip item',
      });
    },
  });

  const categories = [
    { id: '', label: 'All Decor' },
    { id: 'plant', label: 'Plants 🪴' },
    { id: 'lamp', label: 'Lighting 💡' },
    { id: 'poster', label: 'Art Prints 🖼️' },
    { id: 'rug', label: 'Cozy Rugs 🧶' },
    { id: 'mug', label: 'Drinks & Mugs ☕' },
    { id: 'wallpaper', label: 'Wallpapers 🎨' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-[#E3A08A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3A2E27] tracking-tight">
              The Cozy Corner Shop
            </h1>
          </div>
          <p className="text-xs text-[#78665B] mt-0.5">
            Exchange your earned Cozy Coins for furniture and decorations that physically appear in your study room
          </p>
        </div>

        {/* Coin Pouch Indicator */}
        <div className="flex items-center gap-2.5 bg-[#FAF3E8] border border-[#E4D3BE] px-5 py-2.5 rounded-2xl shadow-xs self-start sm:self-auto">
          <Coins className="w-6 h-6 text-[#F4C572]" />
          <div>
            <span className="text-[10px] font-bold text-[#78665B] uppercase block leading-none">
              Your Coin Pouch
            </span>
            <span className="text-lg font-extrabold text-[#855D16]">
              {user?.cozyCoins || 0} Cozy Coins
            </span>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-[#9CAF88]/20 border-[#9CAF88]/50 text-[#4D6339]'
              : 'bg-red-100 border-red-200 text-red-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#E3A08A] text-[#3A2E27] shadow-sm font-bold'
                  : 'bg-[#F0E4D3] text-[#78665B] hover:text-[#3A2E27] border border-[#E4D3BE]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Shop Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#F0E4D3] rounded-2xl p-5 border border-[#E4D3BE] space-y-3">
              <Skeleton width="w-20" height="h-4" rounded="rounded-full" />
              <Skeleton width="w-full" height="h-28" rounded="rounded-xl" />
              <Skeleton width="w-3/4" height="h-5" />
              <Skeleton width="w-full" height="h-4" />
            </div>
          ))}
        </div>
      ) : shopItems.length === 0 ? (
        <div className="bg-[#FFF9E6] border border-[#EFE2B8] rounded-3xl p-12 text-center">
          <span className="text-4xl mb-3">🪴</span>
          <h3 className="text-lg font-bold text-[#3A2E27]">No Items In This Category</h3>
          <p className="text-xs text-[#78665B] mt-1">Check back soon as new seasonal stock arrives!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
