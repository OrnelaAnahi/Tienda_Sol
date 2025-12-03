import {z} from "zod";

export const DireccionEntregaSchema = z.object({
    calle: z.string(),
    altura: z.string(),
    piso: z.string().optional(),
    departamento: z.string().optional(),
    codigoPostal: z.string(),
    ciudad: z.string(),
    provincia: z.string(),
    pais: z.string(),
    lat: z.string(),
    lon: z.string(),
});

export class DireccionEntrega {
    
    constructor(payload) {
        const parsed = DireccionEntregaSchema.parse(payload);

        this.calle = parsed.calle;
        this.altura = parsed.altura;
        this.piso = parsed.piso;
        this.departamento = parsed.departamento;
        this.codigoPostal = parsed.codigoPostal;
        this.ciudad = parsed.ciudad;
        this.provincia = parsed.provincia;
        this.pais = parsed.pais;
        this.lat = parsed.lat;
        this.lon = parsed.lon;
    }

    direccionEntrega(){
        return `${this.calle} ${this.altura}, ${this.piso ? 'Piso ' + this.piso : ''} ${this.departamento ? 'Depto ' + this.departamento : ''}, ${this.codigoPostal}, ${this.ciudad}, ${this.provincia}, ${this.pais}`;
    }
}

