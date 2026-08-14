export class DateUtils{
    static getMonth=(date:Date):number=>{
        return (new Date(date).getMonth() + 1);
    }
}