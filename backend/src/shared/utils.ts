import { Prisma } from "generated/prisma/client";

export const   prismaToNumber = (v: number | null | undefined):number=>{
    return v ? Number(v) : 0
}