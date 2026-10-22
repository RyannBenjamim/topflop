import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { HighlightsModule } from './highlights/highlights.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    MoviesModule,
    HighlightsModule,
    WatchlistModule
  ],
})
export class CinemaModule {}