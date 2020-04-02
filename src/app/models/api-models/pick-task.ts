import { PickTask as Interface } from '@pickvoice/pickvoice-api/model/pickTask';
import { PickTaskLine } from './pick-task-line';
export class PickTask implements PickTask {
    id?: number;
    /**
     * Nombre largo de la tarea
     */
    description?: string;
    /**
     * Task Completion Date
     */
    enableDate?: string;
    /**
     * User assignment date
     */
    dateAssignment?: string;
    /**
     * create date
     */
    date?: string;
    /**
     * prioridad de la tarea 1 a 10
     */
    priority?: number;
    /**
     * No de lineas que contiene la tarea
     */
    lines?: number;
    /**
     * Cantidad de producto a recoger
     */
    qyt?: number;
    /**
     * No de documento relacionado
     */
    document?: string;
    /**
     * Estado de la tarea (  PE - Pending,  AC - Active,WP - Work In Progress,PS - Paused,CP - Complete,CA - Canceled)
     */
    taskState?: Interface.TaskStateEnum;
    /**
     * usuario asignado a la tarea
     */
    user?: string;
    /**
     * Tipo de tarea
     */
    taskType?: string;
    /**
     * linea actual de ejecucion
     */
    currentLine?: number;
    /**
     * codigo de tarea de origen
     */
    childrenWork?: string;
    pickTaskLines?: PickTaskLine[];
    constructor() {
        this.childrenWork = '';
        this.currentLine = 0;
        this.date = '';
        this.dateAssignment = '';
        this.description = '';
        this.document = '';
        this.enableDate = '';
        this.id = 0;
        this.lines = 0;
        this.pickTaskLines = [];
        this.priority = 0;
        this.qyt = 0;
        this.taskState = Interface.TaskStateEnum.AC;
        this.taskType = '';
        this.user = '';
    }
}
