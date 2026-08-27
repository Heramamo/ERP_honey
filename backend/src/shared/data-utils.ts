export class DateUtils{
    static getMonth=(date:Date):number=>{
        return (new Date(date).getMonth() + 1);
    }
}
export function getBornesMois(mois: string): { debut: Date; fin: Date } {
  const [year, month] = mois.split('-').map(Number);
  const debut = new Date(Date.UTC(year, month - 1, 1));
  const fin = new Date(Date.UTC(year, month, 1));
  return { debut, fin };
}
