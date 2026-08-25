import { Role } from "src/generated/prisma/enums"

export const isADminRh=(role:Role):boolean=>
{
    return (role == "ADMIN" || role == "RH")
}