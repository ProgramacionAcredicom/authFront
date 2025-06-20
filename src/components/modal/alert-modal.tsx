import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "../ui/modal";
import { Loader2 } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading, title, description, children, className }) => {
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
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose} className={className}>
      {children}
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="custom2" onClick={onConfirm}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};
