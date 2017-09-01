import {Service} from "ts-express-decorators";
import {IUser} from "../entity/IUser";
import {User} from "../schema/UserSchema";
import UserService from "./UserService";
import * as Passport from 'passport';
import {Strategy} from "passport-local";
import {$log} from "ts-log-debug";

@Service()
export default class SecurityService {

    constructor(private userService: UserService) {
        console.log("SecurityService.constructor");
        // used to serialize the user for the session
        Passport.serializeUser(SecurityService.serialize);
        // used to deserialize the user
        Passport.deserializeUser(this.deserialize.bind(this));
        this.initLocalLogin();
    }

    static serialize(user, done){
        done(null, user._id);
    }

    public deserialize(id, done) {
        this.userService.find(id).then((user) => {
            done(null, user);
        });
    }

    public initLocalLogin(){
        Passport.use('local', new Strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, this.onLocalLogin));
    }

    private onLocalLogin = (req, username, password, done) => {
        this.userService.find({username}).then((user) => { //TODO make a findOne method
            //TODO check password
            if(user.length > 0) {
                $log.debug('Login success username =', username);
                return done(null, user[0]);
            }
        }, () => {
            $log.debug('Login denied username =', username);
            return done(null, false);
        });
    };

    // public initLocalSignup(){
    //     Passport.use('signup', new Strategy({
    //                 // by default, local strategy uses username and password, we will override with email
    //                 usernameField :     'email',
    //                 passwordField :     'password',
    //                 passReqToCallback:  true // allows us to pass back the entire request to the callback
    //         },
    //         (req, email, password, done) => {
    //             console.log('LOCAL SIGNUP', email, password);
    //             // asynchronous
    //             // User.findOne wont fire unless data is sent back
    //             process.nextTick(() => {
    //                 this.onLocalSignup(req, email, password, done);
    //             });
    //         }))
    // }

    // private onLocalSignup(req, email, password, done): void {
    //     const user = this.userService.find({email});
    //     if (user) { //User exists
    //         return done(null, false);
    //     }
    //
    //     // Create new User
    //     const newUser = this.userService.save(<any>{
    //         email: email,
    //         password: password,
    //         name: {
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName
    //         }
    //     });
    //
    //     done(null, newUser);
    //
    // }

}