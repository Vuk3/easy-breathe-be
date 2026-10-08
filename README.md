# Easy Breathe API

The NestJS API of Easy Breathe, a mobile app that narrows Serbia's open pollen readings to the
allergens one person reacts to, near where they are. It mirrors the open data into MongoDB on a
schedule, so the app asks one local question instead of paging through national
measurements.

The full write-up: [vukcvetkovic.com/projects/easy-breathe](https://vukcvetkovic.com/projects/easy-breathe/)

Made for a seminar paper on e-government systems at the Faculty of Electronic Engineering in
Niš, with Đorđe Petković.

## The system

| Repository | Role |
| --- | --- |
| [easy-breathe-fe](https://github.com/Vuk3/easy-breathe-fe) | React Native and Expo app: the account, the map, the levels and the alerts |
| **easy-breathe-be** | NestJS API: mirrors the open pollen data into MongoDB and answers for one user's location |

```
open pollen data  ->  scheduled seeders  ->  MongoDB
                                               |
app  ->  PATCH /users/location  ->  stations in your radius  ->  today's readings  ->  levels
```

## How it works

- **The open data is mirrored on two clocks.** The five open endpoints do not change at the
  same rate, so they are not fetched at the same rate. Allergens, allergen types and locations
  are seeded at 09:00 on the first of every month. Pollens and concentrations, the ones that
  move, are fetched every hour from 09:00 to 12:00, when the day's measurements appear. Each
  is a `@Cron` job in its own module.
- **Seeding is safe to repeat.** Every seeder looks up which ids it already holds and inserts
  only the rest, so a run that finds nothing new writes nothing. Concentrations are asked for
  from a week back and pollens from a month back, far enough to pick up a reading published
  days after it was taken.
- **A location and a radius become a set of stations.** When the app sends the user's
  coordinates, they are saved on the account and go into a MongoDB `$geoWithin` /
  `$centerSphere` query with the user's radius in kilometres, divided by the earth's own
  (6378.1 km) because the query takes radians.
- **Stations become the readings that count.** Those station ids and today's date select the
  day's pollen records, each carrying the ids of the concentrations measured with it, and
  every concentration is given a level: Low under 50, Moderate under 100, High under 200 and
  Very high above.
- **Accounts.** Passwords are checked for strength and hashed with bcrypt. Sign-in is a
  Passport local strategy that issues a JWT access token and a refresh token, and refresh
  tokens are stored per user, so one device or every device can be logged out. Email
  confirmation and password reset codes go out through SendGrid.

## Endpoints

Routes that read or change the signed-in user's data take the access token as a bearer token.

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/users` | Sign up |
| `POST` | `/users/login` | Sign in, returning the access and refresh tokens |
| `GET` | `/users/refresh` | New tokens from a refresh token |
| `GET` | `/users/me` | The signed-in user |
| `PATCH` | `/users` | Update the profile: details, allergens, radius |
| `PATCH` | `/users/location` | Save the user's coordinates and look up the readings around them |
| `PATCH` | `/users/logout` | Log out this device |
| `POST` | `/users/logoutAll` | Log out every device |
| `GET` | `/users/confirm-email`, `/users/resend-email` | Confirm the email address, or send the code again |
| `POST` | `/users/changePassword` | Change the password |
| `GET` | `/users/reset/:email` | Send a password reset code |
| `POST` | `/users/reset-password` | Set a new password with that code |
| `DELETE` | `/users/me` | Delete the account |
| `GET` | `/allergens`, `/allergenTypes`, `/locations`, `/pollens`, `/concentrations` | The mirrored data, and `/:id` on each for one record |
| `POST` | the same five | Run that seeder now instead of waiting for its schedule |

## Configuration

Create a `.env` in the root. It is git-ignored.

| Variable | Meaning |
| --- | --- |
| `PORT` | Port the API listens on |
| `MONGODB_URL` | MongoDB connection string |
| `OPEN_API_URL` | Base URL of the open pollen data API |
| `JWTSECRET` | Secret for access tokens |
| `JWTREFRESHSECRET` | Secret for refresh tokens |
| `ROUNDS` | bcrypt salt rounds |
| `SEND_GRID_KEY` | SendGrid API key, for the confirmation and reset emails |
| `EMAIL_SENDER` | The address those emails are sent from |

## Running it

Node and a MongoDB instance.

```bash
npm install
npm run start:dev
```

The seeders run on their schedules. To fill an empty database straight away, send a `POST` to
each of the five data endpoints once, allergen types, allergens and locations first.
