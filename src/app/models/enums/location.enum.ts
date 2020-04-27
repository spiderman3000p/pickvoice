// tslint:disable-next-line:no-namespace
export class Location {
    public static LocationStateEnum = [
        'DO', 'OC', 'A', 'I', 'DL', 'BL', 'RE', 'RI'
    ];
    public static LocationTypeEnum = [
        'Location', 'Dock', 'Transit'
    ];
    public static OperationTypeEnum = [
        'Picking', 'Storage'
    ];
    public static RackTypeEnum = [
        'SR', 'DI', 'PB', 'DT', 'CV', 'MZ'
    ];
}
