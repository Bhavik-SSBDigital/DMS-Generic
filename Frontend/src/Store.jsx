import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const sessionData = create(
  persist(
    (set) => ({
      work: '',
      notifications: [],
      setWork: (work) => set({ work }),
      setNotifications: (notifications) => set({ notifications })
    }),
    {
      name: 'store-data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default sessionData;
