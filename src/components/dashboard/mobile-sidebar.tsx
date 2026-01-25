'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar className="w-full border-r-0" />
      </SheetContent>
    </Sheet>
  );
}