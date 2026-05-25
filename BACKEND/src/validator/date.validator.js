import z from 'zod';
export const timeValidation = z.string().datetime({ offset: true }).transform((val) => new Date(val)).refine((date) => date.getTime() > Date.now(), {
    message: "Date must be in the future",
})