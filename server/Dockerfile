# UtilityHub YouTube backend — Node + ffmpeg + yt-dlp
FROM node:22-slim

# System binaries: ffmpeg (merge/clip/mp3) and python3 (yt-dlp runtime).
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg python3 ca-certificates curl \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp \
  && apt-get purge -y curl && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

ENV PORT=4000
EXPOSE 4000
CMD ["node", "index.js"]
