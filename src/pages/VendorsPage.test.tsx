import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FoodPlanProvider } from '@/features/plan/FoodPlanProvider';
import { AppRoutes } from '@/App';

afterEach(cleanup);
it('browses vendors, searches without case or accent sensitivity, and opens their menu with source links', async () => {
  render(<MemoryRouter initialEntries={['/vendors']}><FoodPlanProvider><AppRoutes /></FoodPlanProvider></MemoryRouter>);
  const user = userEvent.setup();
  expect(screen.getByRole('link', {name:'Vendors'})).toHaveAttribute('aria-current','page');
  const input = screen.getByRole('searchbox', {name:'Find a vendor'});
  await user.type(input, 'CREME BRU');
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('link',{name:'Instagram'})).toHaveAttribute('href','https://www.instagram.com/cremebru.la/');
  await user.click(screen.getByRole('link',{name:/view.*menu/i}));
  expect(screen.getByRole('heading',{name:'Crème Bru LA'})).toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Instagram'})).toHaveAttribute('href','https://www.instagram.com/cremebru.la/');
  await user.click(screen.getByRole('button',{name:'More about Crème Brûlée'}));
  expect(screen.getByText(/Sweet Corn/)).toBeInTheDocument();
  expect(screen.getByRole('link',{name:/Big E flavors/})).toHaveAttribute('href',expect.stringContaining('/DdbyWuox2U0/'));
});
it('shows an empty state for an unknown vendor search', async () => {
  render(<MemoryRouter initialEntries={['/vendors?q=not-a-real-vendor-xyz']}><FoodPlanProvider><AppRoutes /></FoodPlanProvider></MemoryRouter>);
  expect(screen.getByText('No vendors match your search.')).toBeInTheDocument();
});
