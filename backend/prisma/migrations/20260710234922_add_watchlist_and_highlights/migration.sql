-- CreateTable
CREATE TABLE "watchlist" (
    "user_id" TEXT NOT NULL,
    "movie_tmdb_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("user_id","movie_tmdb_id")
);

-- CreateTable
CREATE TABLE "annual_highlights" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "top_movie_id" INTEGER,
    "flop_movie_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annual_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annual_highlights_user_id_year_key" ON "annual_highlights"("user_id", "year");

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_movie_tmdb_id_fkey" FOREIGN KEY ("movie_tmdb_id") REFERENCES "movies"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_highlights" ADD CONSTRAINT "annual_highlights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_highlights" ADD CONSTRAINT "annual_highlights_top_movie_id_fkey" FOREIGN KEY ("top_movie_id") REFERENCES "movies"("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_highlights" ADD CONSTRAINT "annual_highlights_flop_movie_id_fkey" FOREIGN KEY ("flop_movie_id") REFERENCES "movies"("tmdb_id") ON DELETE SET NULL ON UPDATE CASCADE;
