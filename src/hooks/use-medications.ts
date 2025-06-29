"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Medication } from '@/lib/types';

const MEDICATIONS_STORAGE_KEY = 'vitalsnap-medications';

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedMedications = localStorage.getItem(MEDICATIONS_STORAGE_KEY);
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
      }
    } catch (error) {
      console.error("Failed to load medications from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  const addMedication = useCallback((newMedication: Omit<Medication, 'id'>) => {
    setMedications(prevMedications => {
      const medicationWithId: Medication = {
        ...newMedication,
        id: new Date().toISOString() + Math.random(), // simple unique id
      };
      const updatedMedications = [...prevMedications, medicationWithId];
      try {
        localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(updatedMedications));
      } catch (error) {
        console.error("Failed to save medications to local storage", error);
      }
      return updatedMedications;
    });
  }, []);

  const removeMedication = useCallback((medicationId: string) => {
    setMedications(prevMedications => {
      const updatedMedications = prevMedications.filter(med => med.id !== medicationId);
      try {
        localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(updatedMedications));
      } catch (error) {
        console.error("Failed to save medications to local storage", error);
      }
      return updatedMedications;
    });
  }, []);
  
  return { medications, addMedication, removeMedication, isLoaded };
}
