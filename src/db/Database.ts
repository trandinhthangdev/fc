import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

// Enable debug mode (only for development)
// SQLite.DEBUG(true);
SQLite.enablePromise(true);

interface Photo {
  width: number;
  height: number;
  url: string;
  loved_at?: string | null;
}

interface Song {
  code: string;
  name: string;
  has_lyric: boolean;
  loved_at?: string | null;
}

class Database {
  private static instance: Database;
  private db: SQLiteDatabase | null = null;

  private constructor() {
    this.initDB();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async initDB(): Promise<void> {
    if (this.db === null) {
      try {
        this.db = await SQLite.openDatabase({
          name: 'idol_app.db',
          location: 'default',
        });
        await this.createTables();
      } catch (error) {
        console.error('Failed to open database:', error);
      }
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    try {
      // Create "photos" table
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          width INTEGER NOT NULL,
          height INTEGER NOT NULL,
          url TEXT UNIQUE NOT NULL,
          loved_at DATETIME DEFAULT NULL
        )`,
      );

      // Create "song" table
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS song (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          has_lyric INTEGER NOT NULL CHECK (has_lyric IN (0, 1)),
          loved_at DATETIME DEFAULT NULL
        )`,
      );
    } catch (error) {
      console.error('Failed to create tables:', error);
    }
  }

  public async addPhoto(
    width: number,
    height: number,
    url: string,
  ): Promise<void> {
    if (!this.db) return;

    try {
      const [result] = await this.db.executeSql(
        `SELECT COUNT(*) as count FROM photos WHERE url = ?`,
        [url],
      );
      const count = result.rows.item(0).count;

      if (count > 0) {
        console.log('Photo with this URL already exists.');
        return;
      }

      await this.db.executeSql(
        `INSERT INTO photos (width, height, url, loved_at) VALUES (?, ?, ?, ?)`,
        [width, height, url, false],
      );
      console.log('Photo added successfully.');
    } catch (error) {
      console.error('Failed to add photo:', error);
    }
  }

  public async addMultiplePhotos(photos: Photo[]): Promise<void> {
    if (!this.db) return;
    if (photos.length === 0) return;

    // try {
    // Construct the SQL query for bulk insertion
    const values: string[] = [];
    const params: any[] = [];

    for (const photo of photos) {
      // Check for duplicate URLs
      const [result] = await this.db.executeSql(
        `SELECT COUNT(*) as count FROM photos WHERE url = ?`,
        [photo.url],
      );
      const count = result.rows.item(0).count;

      if (count === 0) {
        values.push('(?, ?, ?)');
        params.push(photo.width, photo.height, photo.url);
        // } else {
        // console.log(`Photo with URL ${photo.url} already exists.`);
      }
    }

    if (values.length > 0) {
      const query = `INSERT INTO photos (width, height, url) VALUES ${values.join(
        ', ',
      )}`;
      await this.db.executeSql(query, params);
      console.log('Photos added successfully.');
    } else {
      console.log('No new photos to add.');
    }
    // } catch (error) {
    // console.error('Failed to add multiple photos:', error);
    // }
  }

  public async getRandomPhotos(
    n: number,
    excludeUrls: string[],
  ): Promise<Photo[]> {
    if (!this.db) return [];

    try {
      const placeholders = excludeUrls.map(() => '?').join(',');
      const query = `
        SELECT width, height, url
        FROM photos
        WHERE url NOT IN (${placeholders})
        ORDER BY RANDOM()
        LIMIT ?
      `;

      const params = [...excludeUrls, n];
      const [results] = await this.db.executeSql(query, params);

      const photos: Photo[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const item = results.rows.item(i);
        photos.push({
          width: item.width,
          height: item.height,
          url: item.url,
          loved_at: item.loved_at,
        });
      }

      return photos;
    } catch (error) {
      console.error('Failed to fetch random photos:', error);
      return [];
    }
  }

  public async toggleLove(url: string): Promise<void> {
    if (!this.db) return;

    try {
      const [result] = await this.db.executeSql(
        `SELECT loved_at FROM photos WHERE url = ?`,
        [url],
      );

      if (result.rows.length > 0) {
        const loved_at = result.rows.item(0).loved_at;

        if (loved_at) {
          // If already loved, set loved_at to NULL
          await this.db.executeSql(
            `UPDATE photos SET loved_at = NULL WHERE url = ?`,
            [url],
          );
          console.log(`Unloved photo with URL: ${url}`);
        } else {
          // If not loved, set loved_at to current datetime
          const currentDateTime = new Date().toISOString();
          await this.db.executeSql(
            `UPDATE photos SET loved_at = ? WHERE url = ?`,
            [currentDateTime, url],
          );
          return currentDateTime;
          console.log(`Loved photo with URL: ${url}`);
        }
      } else {
        console.log(`No photo found with URL: ${url}`);
      }
    } catch (error) {
      console.error('Failed to toggle love status:', error);
    }
  }

  public async getPhotosLovedAt(
    n: number,
    excludeUrls: string[],
  ): Promise<Photo[]> {
    if (!this.db) return [];

    try {
      // Generate placeholders for excluded URLs
      const placeholders = excludeUrls.map(() => '?').join(',');

      // Construct query
      const query = `
        SELECT width, height, url, loved_at
        FROM photos
        WHERE loved_at IS NOT NULL
        ${excludeUrls.length > 0 ? `AND url NOT IN (${placeholders})` : ''}
        ORDER BY loved_at DESC
        LIMIT ?
      `;

      // Add the number of photos (`n`) to the end of the parameters
      const params = [...excludeUrls, n];

      // Execute the query
      const [results] = await this.db.executeSql(query, params);

      const photos: Photo[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const item = results.rows.item(i);
        photos.push({
          width: item.width,
          height: item.height,
          url: item.url,
          loved_at: item.loved_at,
        });
      }

      return photos;
    } catch (error) {
      console.error('Failed to fetch loved photos:', error);
      return [];
    }
  }

  public async addSong(code: string, name: string): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.executeSql(`INSERT INTO song (code, name) VALUES (?, ?)`, [
        code,
        name,
      ]);
      console.log('Song added successfully.');
    } catch (error) {
      console.error('Failed to add song:', error);
    }
  }

  public async addMultipleSongs(songs: Song[]): Promise<void> {
    if (!this.db || songs.length === 0) return;

    try {
      const values: string[] = [];
      const params: any[] = [];

      for (const song of songs) {
        values.push('(?, ?, ?)');
        params.push(song.code, song.name, song.has_lyric ? 1 : 0);
      }

      const query = `INSERT INTO song (code, name, has_lyric) VALUES ${values.join(
        ', ',
      )} 
                     ON CONFLICT(code) DO NOTHING`;

      await this.db.executeSql(query, params);
      console.log('Multiple songs added successfully.');
    } catch (error) {
      console.error('Failed to add multiple songs:', error);
    }
  }

  public async toggleSongLove(code: string): Promise<void> {
    if (!this.db) return;

    try {
      const [result] = await this.db.executeSql(
        `SELECT loved_at FROM song WHERE code = ?`,
        [code],
      );

      if (result.rows.length > 0) {
        const loved_at = result.rows.item(0).loved_at;

        if (loved_at) {
          await this.db.executeSql(
            `UPDATE song SET loved_at = NULL WHERE code = ?`,
            [code],
          );
          console.log(`Unloved song with code: ${code}`);
        } else {
          const currentDateTime = new Date().toISOString();
          await this.db.executeSql(
            `UPDATE song SET loved_at = ? WHERE code = ?`,
            [currentDateTime, code],
          );
          return currentDateTime;
          console.log(`Loved song with code: ${code}`);
        }
      } else {
        console.log(`No song found with code: ${code}`);
      }
    } catch (error) {
      console.error('Failed to toggle love status of song:', error);
    }
  }

  public async getSongs(page: number, pageSize: number): Promise<Song[]> {
    if (!this.db) return [];

    const offset = (page - 1) * pageSize;

    try {
      const [result] = await this.db.executeSql(
        `SELECT * FROM song LIMIT ? OFFSET ?`,
        [pageSize, offset],
      );

      const songs: Song[] = [];
      const rows = result.rows;

      for (let i = 0; i < rows.length; i++) {
        const item = rows.item(i);
        songs.push({
          code: item.code,
          name: item.name,
          has_lyric: item.has_lyric === 1,
        });
      }

      return songs;
    } catch (error) {
      console.error('Failed to retrieve songs:', error);
      return [];
    }
  }

  public async getAllSongs(): Promise<Song[]> {
    if (!this.db) return [];

    try {
      const query = `SELECT * FROM song`;
      const [result] = await this.db.executeSql(query, []);

      const songs: Song[] = [];
      const rows = result.rows;

      for (let i = 0; i < rows.length; i++) {
        const item = rows.item(i);
        songs.push({
          code: item.code,
          name: item.name,
          has_lyric: item.has_lyric === 1,
          loved_at: item.loved_at,
        });
      }

      return songs;
    } catch (error) {
      console.error('Failed to retrieve songs sorted by loved_at:', error);
      return [];
    }
  }
}

export default Database.getInstance();
