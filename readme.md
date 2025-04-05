### Twilio Playgound<img src="public/twilios.jpg" width="25px"></img>

<img src="public/demo.png" width="400px"></img>

#### Requirement

Sign up for a twilio account and purchase a phone number.

Then, Write your account credential to the .env file

```
TWILIO_ACCOUNT_SID=***YOUR ACCOUNT SID**
TWILIO_AUTH_TOKEN=***YOUR AUTH TOKEN***
TWILIO_PHONE_NUMBER=***YOUR PHONE NUMBER***
```

---

#### Install

Run these command in the root directory

- `pnpm i`
- `pnpm run dev`

---

- Features:
  - UI (client)
    - Make call
    - Display call history grouped by date
  - Backend (sever)
    - Use Swagger UI to document and test api endpoints
    - Integrate twilio service
    - Transform sensitive data (masking phone number)
    - Transform call histories, grouped/keyed by date (YYYY-MM-DD), also update swagger schema

---

- ToDo:
  - Optimization
    - Compress all js in production build, reduce bundle size with treeshaking, lazy load, memoization
    - Use react profiler and lighthouse to identify performance bottlenecks
    - server side rendering SSR using Next.js
    - purge css in production build
  - UI
    - Add login and logout
    - For logged in user
      - Add options (twilio xml templates) to automate key presses
      - Add a page for user to create customize template
      - Add a page to display recorded calls
  - Backend
    - Display templates list created by current user
    - Add another endpoint to display recorded calls
