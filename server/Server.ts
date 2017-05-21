import * as Express from "express";
import {ServerLoader, IServerLifecycle, ServerSettings} from "ts-express-decorators";
import {$log} from "ts-log-debug";
import * as path from "path";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as Passport from 'passport';

const rootDir = path.resolve(__dirname);


@ServerSettings({
    rootDir: rootDir,
    port: 8080,
    mount: {
        "/api":`${rootDir}/web/**/**.js`
    },
    componentsScan: [
        `${rootDir}/service/**/**.js`
    ],
    acceptMimes: ["application/json"],
    serveStatic: {"/":`${rootDir}/../webapp`}
})
export class Server extends ServerLoader implements IServerLifecycle {

    /**
     * This method lets you configure the middleware required by your application.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void|Promise<any> {

        const cookieParser = require('cookie-parser');
        const bodyParser = require('body-parser');
        const compress = require('compression');
        const methodOverride = require('method-override');
        const session = require('express-session');

        this.use(morgan('dev'))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(session({
                secret: 'secretkey',
                resave: true,
                saveUninitialized: true,
                maxAge: 36000,
                cookie: {
                    path: '/',
                    httpOnly: true,
                    secure: false,
                    maxAge: null
                }
            }))
            .use(Passport.initialize())
            .use(Passport.session());

        return null;
    }

    public $onInit(): Promise<string> {
        $log.info("Connecting to DB...");
        return new Promise((resolve, reject) => {
            mongoose.connect("mongodb://localhost/test", {promiseLibrary:Promise});
            mongoose.connection.once('open', resolve);
            mongoose.connection.on('error', reject);
        });
    }

    public $onReady() {
        $log.info('Server initialized')
    }

    public $onServerInitError(err){
        $log.error(err);
    }

    public $onAuth(request, response, next): void {
        next(request.isAuthenticated());
    }

}
