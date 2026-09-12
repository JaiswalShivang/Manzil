import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/client';
import { ShopItemCard } from '../components/shop/ShopItemCard';
import { Avatar } from '../components/avatar/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { Coins, Sparkles, Scissors, Shirt, Footprints, Sword } from 'lucide-react';
import { PantsIcon } from '../components/ui/PantsIcon';

const slotTabs = [
  { key: 'hair', label: 'HAIR', icon: Scissors },
  { key: 'chest', label: 'SHIRT', icon: Shirt },
  { key: 'pants', label: 'PANTS', icon: PantsIcon },
  { key: 'shoes', label: 'SHOES', icon: Footprints },
  { key: 'weapon', label: 'WEAPONS', icon: Sword },
  { key: 'aura', label: 'AURAS & CRYSTALS', icon: Sparkles },
];

export const ShopPage = () => {
  const { user, updateUserData } = useAuth();

  const [activeSlot, setActiveSlot] = useState('hair');
  const [notification, setNotification] = useState(null);

  // Fetch shop items
  const { data: shopData, isLoading } = useQuery({
    queryKey: ['shop', activeSlot],
    queryFn: async () => {
      const url = activeSlot ? `/shop/items?itemType=${activeSlot}` : '/shop/items';
      const res = await api.get(url);
      return res.data;
    },
  });

  const shopItems = shopData?.items || [];

  // Determine owned item IDs
  const inventory = user?.inventory || [];
  const ownedItemIds = new Set(
    inventory.map((inv) => (inv?._id || inv?.itemId?._id || inv?.itemId || inv).toString())
  );

  // Determine equipped items via user.equipped
  const userEquipped = user?.equipped || {
    hair: null,
    chest: null,
    pants: null,
    shoes: null,
    weapon: null,
    aura: null,
  };

  const getEquippedIdForSlot = (slot) => {
    const val = userEquipped[slot];
    return (val?._id || val)?.toString() || null;
  };

  // Purchase Item Mutation with instant optimistic update
  const purchaseMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await api.post(`/shop/purchase/${itemId}`);
      return res.data;
    },
    onMutate: async (itemId) => {
      const previousUser = user;
      const targetItem = shopItems.find((i) => i._id === itemId);
      if (targetItem) {
        const slotKey = targetItem.itemType === 'crystal' ? 'aura' : targetItem.itemType;
        updateUserData({
          cozyCoins: Math.max(0, (user?.cozyCoins || 0) - (targetItem.goldCost || targetItem.cost || 0)),
          inventory: [...(user?.inventory || []), targetItem],
          equipped: {
            ...(user?.equipped || {}),
            [slotKey]: targetItem,
          },
        });
      }
      return { previousUser };
    },
    onSuccess: (data) => {
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err, itemId, context) => {
      if (context?.previousUser) {
        updateUserData(context.previousUser);
      }
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'TRANSACTION REJECTED',
      });
    },
  });

  // Equip Item Mutation with instant optimistic update
  const equipMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await api.patch('/equip', { itemId });
      return res.data;
    },
    onMutate: async (itemId) => {
      const previousUser = user;
      const targetItem = shopItems.find((i) => i._id === itemId);
      if (targetItem) {
        const slotKey = targetItem.itemType === 'crystal' ? 'aura' : targetItem.itemType;
        updateUserData({
          equipped: {
            ...(user?.equipped || {}),
            [slotKey]: targetItem,
          },
        });
      }
      return { previousUser };
    },
    onSuccess: (data) => {
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err, itemId, context) => {
      if (context?.previousUser) {
        updateUserData(context.previousUser);
      }
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'EQUIP FAILED',
      });
    },
  });

  // Unequip Slot Mutation with instant optimistic update
  const unequipMutation = useMutation({
    mutationFn: async (payload) => {
      const body = typeof payload === 'string' ? { itemType: payload } : payload;
      const res = await api.patch('/equip/unequip', body);
      return res.data;
    },
    onMutate: async (payload) => {
      const previousUser = user;
      let targetSlot = typeof payload === 'string' ? payload : payload?.itemType;
      if (payload?.itemId && !targetSlot) {
        const found = shopItems.find((i) => i._id === payload.itemId);
        if (found) targetSlot = found.itemType;
      }
      if (targetSlot === 'crystal') targetSlot = 'aura';
      if (targetSlot) {
        updateUserData({
          equipped: {
            ...(user?.equipped || {}),
            [targetSlot]: null,
          },
        });
      }
      return { previousUser };
    },
    onSuccess: (data) => {
      if (data.user) {
        updateUserData(data.user);
      }
    },
    onError: (err, payload, context) => {
      if (context?.previousUser) {
        updateUserData(context.previousUser);
      }
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'UNEQUIP FAILED',
      });
    },
  });

  const isProcessing = false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Overwatch Header Banner */}
      <div className="bg-[#141414] text-[#F5F3EF] border-3 border-[#141414] p-6 sm:p-8 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-heading font-bold text-[#F2B705] uppercase">
              // AVATAR ARMORY & EQUIPMENT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight uppercase text-white">
            THE VAULT
          </h1>
          <p className="text-xs font-mono text-[#F5F3EF]/70 mt-1 uppercase">
            ACQUIRE TACTICAL SPRITE ASSETS TO CUSTOMIZE YOUR CHARACTER'S ON-DUTY RIG.
          </p>
        </div>

        {/* Live User Telemetry Badge */}
        <div className="flex items-center gap-4">
          <div className="bg-[#2B4AE8] text-white border-2 border-[#141414] px-4 py-2 shadow-brutal-sm">
            <div className="text-[10px] font-heading font-black uppercase">CLEARANCE</div>
            <div className="text-xl font-heading font-black">LV. {user?.level || 1}</div>
          </div>

          <div className="bg-[#F2B705] text-[#141414] border-2 border-[#141414] px-4 py-2 shadow-brutal-sm">
            <div className="text-[10px] font-heading font-black uppercase flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> AVAILABLE GOLD
            </div>
            <div className="text-xl font-heading font-black">{user?.cozyCoins || 0}</div>
          </div>
        </div>
      </div>

      {/* Live Fitting Room Character Preview Banner */}
      <div className="bg-[#FAF3E8] border-3 border-[#141414] p-4 sm:p-6 shadow-brutal flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 bg-[#2B4AE8] border-3 border-[#141414] flex items-center justify-center relative overflow-hidden shadow-brutal-sm shrink-0">
            <Avatar equipped={userEquipped} scale={2} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase bg-[#141414] text-white px-2 py-0.5">
              CURRENT LOADOUT PREVIEW
            </span>
            <h3 className="text-base font-heading font-black text-[#141414] uppercase mt-1">
              ADVENTURER STATUS: {user?.username || 'AGENT'}
            </h3>
            <p className="text-xs font-mono text-[#141414]/70 mt-0.5 uppercase">
              Purchasing or equipping items will instantly update your character's live sprite walk cycle.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold">
          {['hair', 'chest', 'pants', 'shoes', 'weapon', 'aura'].map((slot) => {
            const item = userEquipped[slot];
            return (
              <span
                key={slot}
                className={`px-2 py-1 border border-[#141414] uppercase ${item ? 'bg-[#2B4AE8] text-white font-black' : 'bg-white text-[#141414]/50'
                  }`}
              >
                {slot}: {item?.name || 'DEFAULT'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 border-3 border-[#141414] shadow-brutal text-xs font-mono font-bold flex items-center justify-between uppercase ${notification.type === 'success'
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

      {/* Slot Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-3 border-[#141414]">
        {slotTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSlot === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSlot(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 font-heading text-xs font-black uppercase transition-none cursor-pointer border-2 border-[#141414] whitespace-nowrap ${isSelected
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

      {/* Item Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#FAF3E8] border-3 border-[#141414] p-5 shadow-brutal space-y-4">
              <Skeleton width="w-24" height="h-4" />
              <Skeleton width="w-full" height="h-32" />
              <Skeleton width="w-3/4" height="h-5" />
              <Skeleton width="w-full" height="h-4" />
            </div>
          ))}
        </div>
      ) : shopItems.length === 0 ? (
        <div className="bg-[#FAF3E8] border-3 border-[#141414] p-12 text-center shadow-brutal">
          <h3 className="text-xl font-heading font-black text-[#141414] uppercase">
            NO ASSETS CATALOGED IN THIS VECTOR
          </h3>
          <p className="text-xs font-mono text-[#141414]/70 mt-2 uppercase">
            Check another equipment category or refresh inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shopItems.map((item) => {
            const isOwned = ownedItemIds.has(item._id?.toString());
            const slotKey = item.itemType === 'crystal' ? 'aura' : item.itemType;
            const equippedId = getEquippedIdForSlot(slotKey);
            const isEquipped = equippedId === item._id?.toString();

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
                onUnequip={(slot, id) => unequipMutation.mutate({ itemType: slot, itemId: id })}
                isProcessing={isProcessing}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
