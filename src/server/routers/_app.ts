import { z } from 'zod';
import { router } from '../trpc';
import boardStateRouter from './board-state';

export const appRouter = router({
    ...boardStateRouter
})

export type AppRouter = typeof appRouter;