import {Service} from "ts-express-decorators";
import {User} from "../schema/UserSchema";
import {IUser} from "../entity/IUser";


@Service()
export default class UserService {

    public get(id: string): Promise<IUser> {
        return User.findById(id).exec();
    }

    public find(query: any): Promise<IUser[]> {
        //TODO pagination
        return User.find(query).exec();
    }

    public save(user: IUser): Promise<IUser> {
        //TODO check for duplicate usernames
        //TODO return new object instead of old
        return User.findOneAndUpdate({_id:user._id}, user, {upsert:true}).exec();
    }

    public delete(id: string): Promise<IUser> {
        return User.findByIdAndRemove(id).exec();
    }

    // public save(user: IUser): Promise<IUser> {
    //     return new Promise((resolve: Function, reject: Function) => {
    //         new User(user).save().then(result => {
    //             resolve(result);
    //         }, rejection => {
    //             reject(rejection);
    //         });
    //     });
    // }

}