export interface Product {
    id: string;         // Identificador único del producto (3-10 caracteres)
    name: string;       // Nombre del producto (5-100 caracteres)
    description: string; // Descripción del producto (10-200 caracteres)
    logo: string;       // URL del logo del producto
    date_release: string; // Fecha de liberación (igual o mayor a la fecha actual)
    date_revision: string; // Fecha de revisión (1 año después de la fecha de liberación)
    showDropdown?: boolean; // Indica si el dropdown está abierto o cerrado
  }
  
  export interface ApiResponse<T> {
    message?: string;
    data: T;
  }