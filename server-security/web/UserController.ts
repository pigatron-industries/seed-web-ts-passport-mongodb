import {
    Controller, Get, Post, Authenticated, Delete, BodyParams, Required, PathParams, QueryParams
} from "ts-express-decorators";
import * as Express from "express";
import {$log} from "ts-log-debug";

import {IUser} from "../entity/IUser";
import UserService from "../service/UserService";


@Controller("/security/user")
export class UserController {

    constructor(private userService: UserService) {
    }

    @Get("/:id")
    @Authenticated()
    public get(@PathParams('id') id: string): Promise<IUser> {
        return this.userService.get(id);
    }

    @Get("")
    @Authenticated()
    public find(@QueryParams('username') username: string): Promise<IUser[]> {
        $log.info('find username=' + username)
        return this.userService.find({
            username
        });
    }

    @Post("")
    @Authenticated()
    public post(@BodyParams("") user: IUser): Promise<IUser> {
        return this.userService.save(user);
    }

    @Delete("/:id")
    @Authenticated()
    public delete(@PathParams("id") id: string) {
        return this.userService.delete(id);
    }

}