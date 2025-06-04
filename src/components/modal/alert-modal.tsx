import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "../ui/modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading, title, description, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  if (!isOpen) {
    return null;
  }
  return (
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      {children}
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="custom2" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};
