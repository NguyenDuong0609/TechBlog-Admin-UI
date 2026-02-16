"use client";

import { Modal, Button } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}

/**
 * Shared modal for confirming deletion actions
 */
export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    itemName,
}: ConfirmDeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            }
        >
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-2">
                    <p className="text-slate-600">
                        {description}
                    </p>
                    {itemName && (
                        <p className="font-medium text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">
                            {itemName}
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
