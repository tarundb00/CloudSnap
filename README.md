# CloudSnap — Temporary Image Storing & Sharing

Full stack app: React (Vite) + Spring Boot + MongoDB + AWS S3.

## Folder layout

```
cloudsnap/
├── backend/          Spring Boot project (com.temp.cloudsnap)
│   └── src/main/java/com/temp/cloudsnap/
│       ├── config/        SecurityConfig, S3Config
│       ├── security/      JwtUtil, JwtAuthFilter, CustomUserDetailsService
│       ├── model/         User, ImageFile (MongoDB documents)
│       ├── repository/    UserRepository, ImageRepository
│       ├── dto/           Request/response objects
│       ├── service/       AuthService, ImageService, S3Service, ImageCleanupScheduler
│       ├── controller/    AuthController, ImageController, ShareController
│       └── exception/     GlobalExceptionHandler + custom exceptions
└── frontend/         React app (Vite)
    └── src/
        ├── api/            axios instance with JWT interceptor
        ├── context/        AuthContext
        ├── components/     Navbar, ImageCard, UploadForm, ProtectedRoute
        └── pages/          Login, Register, Dashboard, SharePage
```

## How it works

1. **Register / Login** — `POST /api/auth/register`, `POST /api/auth/login`. Returns a JWT stored in `localStorage` on the frontend and sent as `Authorization: Bearer <token>` on every request after.
2. **Upload** — `POST /api/images/upload` (multipart: `file`, `expiryMinutes`). Backend rejects the upload with a 400 if the user already has **5 active images**. The file is streamed straight to S3 under key `{username}/{uuid}_{filename}`; metadata (owner, s3Key, shareId, uploadTime, expiryTime) is saved to MongoDB.
3. **Share link** — each image gets a random `shareId` (UUID). The frontend builds a link like `http://localhost:5173/share/<shareId>`.
4. **Viewing a share link** — `GET /api/share/{shareId}` is public (no auth). If `now > expiryTime`, the backend deletes the S3 object + MongoDB record on the spot and returns `410 Gone`, which the frontend renders as a "Timeout" screen. Otherwise it returns a short-lived (5 min) presigned S3 GET URL for the actual image bytes — this presigned URL is separate from your chosen expiry time, it just lets the browser fetch the picture.
5. **Background cleanup** — `ImageCleanupScheduler` runs every 60 seconds and deletes any image whose `expiryTime` has passed, even if nobody ever opened the share link, so storage doesn't pile up with unopened expired images.
6. **5-image cap** — enforced server-side in `ImageService.uploadImage()` via `imageRepository.countByOwner(owner)`. Once you delete an image (or it expires), a new slot opens up.

## Before you run it

### 1. Fix the region mismatch
Your original `application.properties` had two different regions:
```
aws.region=ap-south-1
aws.s3.region=eu-north-1
```
I standardized on **`aws.s3.region`** everywhere in the code (S3Config, S3Service). Set it to whatever region your `tarun-cloud-share` bucket is actually in.

### 2. Environment variables (backend)
```bash
export AWS_ACCESS_KEY=your_access_key
export AWS_SECRET_KEY=your_secret_key
# optional, otherwise a dev default is used — set a real one in production
export JWT_SECRET=some-long-random-string-at-least-32-chars
```

### 3. S3 bucket policy
The backend uploads privately and serves images via presigned URLs, so your bucket does **not** need to be public. Just make sure the IAM user behind your access/secret key has `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` on `tarun-cloud-share`.

### 4. MongoDB
Have a local MongoDB running on `mongodb://localhost:27017` (or update `spring.data.mongodb.uri`).

## Run the backend

```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## API summary

| Method | Endpoint                | Auth | Purpose                                  |
|--------|--------------------------|------|-------------------------------------------|
| POST   | /api/auth/register        | No   | Create account, returns JWT               |
| POST   | /api/auth/login           | No   | Log in, returns JWT                       |
| POST   | /api/images/upload        | Yes  | Upload image (`file`, `expiryMinutes`)    |
| GET    | /api/images                | Yes  | List current user's images (max 5)        |
| DELETE | /api/images/{id}          | Yes  | Delete an image                           |
| GET    | /api/share/{shareId}      | No   | Fetch a shared image, or 410 if expired    |

## Things you may want to change

- **Presigned URL TTL** (`ImageService.getSharedImage`, currently 5 minutes) — bump it up if a viewer might spend a long time looking at a large image on a slow connection.
- **Max file size** — currently 10MB (`spring.servlet.multipart.max-file-size`).
- **CORS origins** — update `app.cors.allowed-origins` when you deploy the frontend somewhere other than localhost.
- **`app.frontend.base-url`** — used to build the share link returned to the dashboard; set it to your deployed frontend URL in production.
