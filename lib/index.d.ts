import Express from 'express';
interface RedirectItem {
    src: string;
    dest: string;
    statusCode?: number;
    method?: string;
    protocol?: string;
    has?: {
        query?: {
            [key: string]: string;
        };
        header?: {
            [key: string]: string;
        };
        cookie?: {
            [key: string]: string;
        };
        host?: string;
        ip?: string;
    };
}
declare type RedirectConfig = RedirectItem[];
export declare const redirectMiddleware: (rawConfig?: RedirectConfig | undefined) => (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void;
export default redirectMiddleware;
