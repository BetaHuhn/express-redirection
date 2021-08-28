import Express from 'express';
interface foundRedirectItem {
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
declare type foundRedirectConfig = foundRedirectItem[];
declare const foundRedirectMiddleware: (rawConfig?: foundRedirectConfig | undefined) => (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void;
export default foundRedirectMiddleware;
