"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WriteContractErrorType } from '@wagmi/core';

// Notification Types and Context
interface Notification {
  id: string;
  message: string;
  status: 'success' | 'error' | 'info';
  transactionHash: `0x${string}` | undefined;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a Transac');
  }
  return context;
};

// Transaction Types and Context
interface TransactionContextType {
  hash: `0x${string}` | undefined;
  writeContract: ((arg: any) => void) | undefined;
  error: WriteContractErrorType | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};


export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: hash, writeContract, error: writeError } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: waitError
  } = useWaitForTransactionReceipt({ hash });

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      // Don't add duplicate notifications for the same transaction
      if (notification.transactionHash && 
          prev.some(n => n.transactionHash === notification.transactionHash && n.status === notification.status)) {
        return prev;
      }
      return [...prev, notification];
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  // Handle write contract errors
  useEffect(() => {
    if (!writeError) return;

    const notificationId = Date.now().toString();
    addNotification({
      id: notificationId,
      message: `Error: ${(writeError as BaseError).shortMessage || writeError.message}`,
      status: 'error',
      transactionHash: hash
    });
  }, [writeError]);

  // Handle transaction confirmation errors
  useEffect(() => {
    if (!waitError) return;

    const notificationId = Date.now().toString();
    
    // Remove any existing confirming notifications
    setNotifications(prev => 
      prev.filter(n => !(n.transactionHash === hash && n.status === 'info'))
    );

    addNotification({
      id: notificationId,
      message: `Transaction failed: ${(waitError as BaseError).shortMessage || waitError.message}`,
      status: 'error',
      transactionHash: hash
    });
  }, [waitError, hash]);

  // Handle confirming state
  useEffect(() => {
    if (!hash || !isConfirming) return;

    const notificationId = Date.now().toString();
    addNotification({
      id: notificationId,
      message: 'Transaction is confirming...',
      status: 'info',
      transactionHash: hash
    });
  }, [hash, isConfirming]);

  // Handle confirmed state
  useEffect(() => {
    if (!hash || !isConfirmed) return;

    const notificationId = Date.now().toString();

    // Remove any existing confirming notifications
    setNotifications(prev => 
      prev.filter(n => !(n.transactionHash === hash && n.status === 'info'))
    );
    
    addNotification({
      id: notificationId,
      message: 'Transaction confirmed successfully!',
      status: 'success',
      transactionHash: hash
    });
  }, [hash, isConfirmed]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      <TransactionContext.Provider value={{ hash, writeContract, error: writeError }}>
        {children}
      </TransactionContext.Provider>
    </NotificationContext.Provider>
  );
};
