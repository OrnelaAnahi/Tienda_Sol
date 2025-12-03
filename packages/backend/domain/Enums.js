import {z} from "zod";

export const Moneda = {
    PESO_ARS : {
        signo: "ARS"
    },
    DOLAR_USA:{
        signo: "USD"
    },
    REAL: {
        signo: "BRL"
    }
}

export const MonedaSchema = z.enum(Object.keys(Moneda));

export const EstadoPedidoEnum = {
  enum: {
    PENDIENTE: "PENDIENTE",
    CONFIRMADO: "CONFIRMADO",
    EN_PREPARACION: "EN_PREPARACION",
    ENVIADO: "ENVIADO",
    ENTREGADO: "ENTREGADO",
    CANCELADO: "CANCELADO"
  },
  mensajes: {
    PENDIENTE: "Tu pedido está pendiente de confirmación",
    CONFIRMADO: "Tu pedido ha sido confirmado por el vendedor",
    EN_PREPARACION: "Tu pedido está siendo preparado",
    ENVIADO: "Tu pedido está en camino",
    ENTREGADO: "Tu pedido ha sido entregado exitosamente",
    CANCELADO: "El pedido ha sido cancelado"
  }
};


export const EstadoPedidoEnumSchema = z.enum(Object.keys(EstadoPedidoEnum.enum));

export const TipoUsuarioEnum = z.enum([
    "ADMIN",
    "VENDEDOR",
    "COMPRADOR"
])