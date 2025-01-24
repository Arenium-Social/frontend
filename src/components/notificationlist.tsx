"use client";
import React, { useEffect, useState } from 'react';
import { useNotification } from '@/lib/transaction-provider';
import { Alert } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationList() {
  const { notifications, removeNotification } = useNotification();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      <AnimatePresence mode="sync">
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            layout
            className="relative group"
          >
            <Alert
              variant={notification.status}
              className="shadow-lg backdrop-blur-sm bg-background/80 relative pr-8"
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium">
                  {notification.message}
                </div>
                {notification.transactionHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${notification.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs opacity-70 hover:opacity-100 underline truncate"
                  >
                    View transaction: {notification.transactionHash}
                  </a>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute right-2 top-2 p-1 rounded-full hover:bg-background/80 transition-colors z-50"
                aria-label="Close notification"
              >
                <X className="h-4 w-4 opacity-70 hover:opacity-100" />
              </button>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
