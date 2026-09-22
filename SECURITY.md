# Security

Do not commit TestZombie API keys, account credentials, browser session data or
other secrets to this repository.

Use environment variables or your CI/CD secret store for credentials. The
`.env.example` file contains names only and must never contain production values.
