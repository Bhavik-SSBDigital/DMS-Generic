import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const sessionData = create(
  persist(
    (set) => ({
      work: '',
      profileImage: "",
      notifications: [],
      alerts: [],
      pickedProcess: "",
      setWork: (work) => set({ work }),
      setPickedProcess: (pickedProcess) => set({ pickedProcess }),
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
