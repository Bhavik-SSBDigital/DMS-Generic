import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const sessionData = create(
  persist(
    (set) => ({
      work: '',
      profileImage: "",
      notifications: [],
      alerts: [],
      pickedProcesses: "",
      setWork: (work) => set({ work }),
      setPickedProcesses: (pickedProcesses) => set({ pickedProcesses }),
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
