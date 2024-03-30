import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const sessionData = create(
  persist(
    (set) => ({
      work: '',
      profileImage: "",
      notifications: [],
      alerts: [],
      setWork: (work) => set({ work }),
      setNotifications: (notifications) => set({ notifications }),
      setProfileImage: (profileImage) => set({ profileImage }),
      setAlerts: (alerts) => set({ alerts })
    }),
    {
      name: 'store-data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default sessionData;
