/*
    
*/
export class RecentOrigin {
    id: string;
    filename: string;
    filepath: string;
    date: Date;
    totalRows: number;
    invalidRows: number;
    importedRows: number;
    rejectedRows: number;
    user: string;
    download: string;

    constructor() {
        this.id = 'origin_' + Date.now();
        this.filename = 'unknow';
        this.filepath = 'unknow';
        this.date = new Date();
        this.totalRows = 0;
        this.invalidRows = 0;
        this.importedRows = 0;
        this.rejectedRows = 0;
        this.user = 'unknow';
        this.download = '';
    }
}
