import { SideShiftQuote, SideShiftOrder } from '../types';

const SIDESHIFT_API = 'https://sideshift.ai/api/v2';

export const sideshiftService = {
  async getCoins() {
    try {
      const response = await fetch(`${SIDESHIFT_API}/coins`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching coins:', error);
      return [];
    }
  },

  async getPairs() {
    try {
      const response = await fetch(`${SIDESHIFT_API}/pairs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching pairs:', error);
      return [];
    }
  },

  async getQuote(depositCoin: string, settleCoin: string, depositAmount: string): Promise<SideShiftQuote | null> {
    try {
      const response = await fetch(`${SIDESHIFT_API}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositCoin,
          settleCoin,
          depositAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get quote');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting quote:', error);
      return null;
    }
  },

  async createOrder(quoteId: string, settleAddress: string, affiliateId?: string): Promise<SideShiftOrder | null> {
    try {
      const response = await fetch(`${SIDESHIFT_API}/shifts/fixed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          settleAddress,
          affiliateId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  async getOrderStatus(orderId: string): Promise<SideShiftOrder | null> {
    try {
      const response = await fetch(`${SIDESHIFT_API}/shifts/${orderId}`);

      if (!response.ok) {
        throw new Error('Failed to get order status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting order status:', error);
      return null;
    }
  },
};
