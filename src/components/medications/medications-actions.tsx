"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Medication } from '@/lib/types';
import MedicationForm from './medication-form';

interface MedicationsActionsProps {
  addMedication: (medication: Omit<Medication, 'id'>) => void;
}

export default function MedicationsActions({ addMedication }: MedicationsActionsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsFormOpen(true)}>
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Medication
      </Button>
      <MedicationForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} addMedication={addMedication} />
    </>
  );
}

