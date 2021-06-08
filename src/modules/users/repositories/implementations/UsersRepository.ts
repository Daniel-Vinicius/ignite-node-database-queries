import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

type Users_games_gamesReturn =
  Array<{ userId: string, gamesId: string }>


export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(user_id);
    const users_games_games: Users_games_gamesReturn = await this.repository.query(`SELECT * FROM users_games_games WHERE "usersId" = '${user_id}'`);
    const finalArrayGamesUser: Game[] = [];

    await Promise.all(users_games_games.map(async (obj): Promise<void> => {
      const [game]: Game[] = await this.repository.query(`SELECT * FROM games WHERE id = '${obj.gamesId}'`);
      finalArrayGamesUser.push(game);
      return;
    }));

    const result = {
      ...user,
      games: finalArrayGamesUser,
    }

    return result as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM users'); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query('SELECT * FROM users'); // Complete usando raw query
  }
}
