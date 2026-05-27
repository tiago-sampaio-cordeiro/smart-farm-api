export interface Measurement {
    id: string;
    sensorId: string;
    temperatura?: number;
    umidade?: number;
    luminosidade?: number;
    timestamp: Date;
}