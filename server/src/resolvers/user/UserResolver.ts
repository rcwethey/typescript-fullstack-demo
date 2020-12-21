import { Arg, Query, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/user';

@Resolver()
export class UserResolver {
  @Query(returns => User)
  async getUser(@Arg("id") id: string) {
    return await User.findOne({ where: { id } })
  }

  @Mutation(returns => User, { nullable: false })
  async addUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("age") age: number
  ): Promise<User> {
    const user = await User.create({
      firstName,
      lastName,
      age
    }).save();
    return user;
  }
};