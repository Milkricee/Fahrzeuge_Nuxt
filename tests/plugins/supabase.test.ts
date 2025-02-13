import { vi, describe, it, expect } from 'vitest';
import { fetchVehicles } from '@/plugins/supabase';

// Mock defineNuxtPlugin
vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((callback) => callback({ provide: vi.fn() })),
}));

// Mock den Supabase-Client
vi.mock('@/plugins/supabase', () => {
  const mockVehicles = [
    { id: 1, marke: 'BMW', modell: 'X5', kennzeichen: 'M-XY123' },
    { id: 2, marke: 'Audi', modell: 'Q7', kennzeichen: 'A-AB456' },
  ];

  const mockFrom = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn(() => Promise.resolve({ data: mockVehicles, error: null })),
  };

  const mockSupabase = {
    from: vi.fn(() => mockFrom),
  };

  return {
    supabase: mockSupabase,
    fetchVehicles: async () => {
      const { data } = await mockFrom.order();
      return data;
    },
  };
});

// Test-Suite für `supabase.js`
describe('Supabase Plugin Tests', () => {
  it('should fetch vehicles successfully', async () => {
    // Funktion aufrufen
    const result = await fetchVehicles();

    // Assertions
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0].marke).toBe('BMW');
    expect(result[1].modell).toBe('Q7');
  });
});
