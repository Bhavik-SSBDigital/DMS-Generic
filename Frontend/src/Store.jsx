import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const sessionData = create(
  persist(
    (set) => ({
      work: '',
      setWork: (work) => set({ work }),
    }),
    {
      name: 'store-data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default sessionData;
