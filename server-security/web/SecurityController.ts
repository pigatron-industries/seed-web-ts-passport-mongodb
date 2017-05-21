import {Controller, Post, BodyParams, Required, Next, Response, Request} from "ts-express-decorators";
import * as Express from "express";
import * as Passport from 'passport';
import SecurityService from "../service/SecurityService";
import {IUser} from "../entity/IUser";

@Controller("/security")
export class SecurityController {

    constructor(private securityService: SecurityService) {
    }

    @Post("/login")
    public login(@Required() @BodyParams('username') username: string,
                 @Required() @BodyParams('password') password: string,
                 @Request() request: Express.Request,
                 @Response() response: Express.Response,
                 @Next() next: Express.NextFunction): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            Passport.authenticate('login', (err, user: IUser) => {
                if(err) {
                    reject(err);
                }
                resolve(user);
                // request.logIn(user, (err) => {
                //     if (err) {
                //         reject(err);
                //     }
                //     resolve(user);
                // });
            })(request, response, next);
        });
    }

}