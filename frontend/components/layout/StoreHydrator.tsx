'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function StoreHydrator() {
  useEffect(() => { useStore.persist.rehydrate(); }, []);
  return null;
}
