# UrbanGent deployment

Deploy the client and server as separate services. MongoDB Atlas and Cloudinary are required for the current features.

## Server

Use the `server` directory as the service root.

- Build command: none
- Start command: `npm start`
- Health check: `/health`

Set these environment variables in the hosting provider:

```text
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=<deployed client URL>
PORT=<provider supplied port, if required>
EMAIL_USER=<SMTP email>
EMAIL_PASS=<SMTP app password>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
```

`CLIENT_URL` may contain comma-separated client origins when preview and production URLs are both needed.

## Client

Use the `client` directory as the service root.

- Build command: `npm run build`
- Publish directory: `dist`

Set this environment variable before building:

```text
VITE_API_URL=https://<deployed-server-domain>
```

The application currently uses browser history routing. Configure the client host to rewrite unknown routes to `index.html`, otherwise refreshing `/shop`, `/account`, or `/admin` can return a 404.

## Before going live

1. Rotate the MongoDB, email, JWT, and Cloudinary credentials that have previously been exposed in the local `.env` file.
2. Restrict the MongoDB Atlas network access and database user permissions.
3. Set the deployed client URL in the server `CLIENT_URL` value.
4. Set the deployed server URL in the client `VITE_API_URL` value and rebuild the client.
5. Confirm `https://<server-domain>/health` returns `{ "status": "ok" }`.
6. Test OTP login, profile image upload, cart, COD checkout, customer orders, and admin order status updates in production.