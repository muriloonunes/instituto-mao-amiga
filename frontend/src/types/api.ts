export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export interface Page<T> {
    content: T[];
    last: boolean;
    number: number;
    totalPages: number;
    totalElements: number;
}