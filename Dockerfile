# Install dependencies only when needed
FROM node:16 AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# ARG VITE_SUPABASE_URL
# ARG VITE_SUPABASE_ANON_KEY
# ARG VITE_PUBLIC_APP_LINK_URL
# ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
# ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
# ENV VITE_PUBLIC_APP_LINK_URL=$VITE_PUBLIC_APP_LINK_URL
ENV NODE_ENV=production
RUN echo $NODE_ENV
# RUN echo $VITE_PUBLIC_APP_LINK_URL
# RUN echo $VITE_SUPABASE_URL
# RUN echo $VITE_SUPABASE_ANON_KEY
RUN npm install -g pnpm
RUN pnpm build && pnpm install --prod --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16 AS runner
WORKDIR /app

ENV NODE_ENV production
RUN echo $NODE_ENV

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["node", "./build/server.js"]
