import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

type Users_games_gamesReturn =
  Array<{ usersId: string, gamesId: string }>

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository.query(`SELECT * FROM games WHERE LOWER(title) like LOWER('%${param}%')`);
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(id) FROM games')
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const users_games_games: Users_games_gamesReturn = await this.repository.query(`SELECT * FROM users_games_games WHERE "gamesId" = '${id}'`);
    const users: User[] = [];

    await Promise.all(users_games_games.map(async (obj): Promise<void> => {
      const [user]: User[] = await this.repository.query(`SELECT * FROM users WHERE id = '${obj.usersId}'`);
      users.push(user);
      return;
    }));

    return users;
  }
}
