# Ticket Management

A minimal **NestJS** learning project that implements a small helpdesk ticketing API. It is intentionally kept simple so that anyone can read and understand how the pieces fit together.

## What it does

- List, create, update, and close support tickets.
- Filter tickets by `status` and `priority`.
- Validate request payloads with `class-validator`.
- Wrap every response in a uniform `{ success, data }` shape.
- Log every incoming request.
- Protect the "close ticket" endpoint behind a simple staff-only guard.
- Implement a delete ticket endpoint.

## How to run

```bash
# install dependencies
npm install

# development (watch mode)
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

The server starts on `http://localhost:3000` (override with `PORT` env var). All routes are prefixed with `/api`.

## API endpoints

All routes are under `/api/tickets`.

| Method | Path         | Auth                 | Description                                          |
| ------ | ------------ | -------------------- | ---------------------------------------------------- |
| GET    | `/`          | none                 | List tickets. Supports query params `status` (`open` | `closed`) and `priority` (`low` | `medium` | `high`). |
| GET    | `/:id`       | none                 | Get a single ticket by id.                           |
| POST   | `/`          | none                 | Create a new ticket.                                 |
| PATCH  | `/:id`       | none                 | Update an open ticket.                               |
| PATCH  | `/:id/close` | `x-staff-key` header | Close a ticket.                                      |

### Example requests

Create a ticket:

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Cannot login","description":"User cannot access the dashboard","priority":"high"}'
```

Close a ticket (staff only):

```bash
curl -X PATCH http://localhost:3000/api/tickets/1/close \
  -H "x-staff-key: helpdesk-staff-secret"
```

## Project structure

```
src/
├── main.ts                        # Entry point: creates the Nest app, sets global prefix, pipes, interceptors
├── app.module.ts                  # Root module; imports TicketsModule
├── common/
│   ├── response.interceptor.ts    # Wraps every response in { success: true, data }
│   └── request-logger.middleware.ts  # Logs method + URL for every request
└── tickets/
    ├── tickets.controller.ts      # HTTP layer: routes + parameter decorators
    ├── tickets.service.ts         # Business logic + in-memory storage
    ├── tickets.module.ts          # Groups controller + service for the tickets feature
    ├── ticket.interface.ts         # The Ticket type
    ├── guards/
    │   └── staff.guard.ts         # CanActivate that checks the x-staff-key header
    └── dto/                       # Data transfer objects validated by class-validator
        ├── create-ticket.dto.ts
        ├── update-ticket.dto.ts
        └── filter-tickets-query.dto.ts
```

## Concepts used (what each thing is for)

### NestJS core building blocks

- **Modules** (`@Module` decorator) - Organize the app into a dependency-injection graph. `AppModule` is the root; `TicketsModule` bundles the tickets controller and service.
- **Controllers** (`@Controller`, `@Get`, `@Post`, `@Patch`, `@Param`, `@Body`, `@Query`) - Handle incoming HTTP requests and route them to services.
- **Providers / Services** (`@Injectable`) - Hold business logic and data access. `TicketsService` keeps an in-memory list of tickets.
- **Dependency Injection** - Controllers receive `TicketsService` through their constructor; Nest resolves it automatically.
- **Middleware** (`NestMiddleware`) - Runs before routing. `RequestLoggerMiddleware` logs each request.
- **Guards** (`CanActivate`) - Allow or reject a request. `StaffGuard` only lets requests with the correct `x-staff-key` header through.
- **Interceptors** (`NestInterceptor`) - Transform the outgoing response. `ResponseInterceptor` adds the `{ success, data }` envelope.
- **Pipes** (`ValidationPipe`) - Validate and transform incoming data. Used globally with `whitelist` and `forbidNonWhitelisted`.

### Validation

- **class-validator** decorators (`@IsString`, `@IsNotEmpty`, `@IsIn`, `@IsOptional`) on DTO classes enforce the shape of request bodies and query params.
- **class-transformer** (pulled in by `class-validator`) is used under the hood by Nest to turn the raw request into the DTO class instance.

### Type safety & tooling

- **TypeScript** with `strict` mode, `experimentalDecorators`, and `emitDecoratorMetadata` (required by Nest's DI).
- **ESM** (`"type": "module"`, `module: nodenext`) - Imports use explicit `.js` extensions.
- **oxlint** for linting.
- **Prettier** for formatting.
- **Vitest** (with `vite-tsconfig-paths`) for unit and e2e tests; `@vitest/coverage-v8` for coverage.

### Other notes

- Data is stored only in memory (an array on `TicketsService`). It resets every time the server restarts - this is fine for learning, not for production.
- The staff secret (`helpdesk-staff-secret`) is hardcoded in `StaffGuard` for simplicity.

## Scripts

| Script               | What it does                      |
| -------------------- | --------------------------------- |
| `npm run start`      | Build once and start the app      |
| `npm run start:dev`  | Start and watch for file changes  |
| `npm run start:prod` | Run the compiled app from `dist/` |
| `npm run build`      | Compile TypeScript to `dist/`     |
| `npm run lint`       | Run oxlint on `src/` and `test/`  |
| `npm run format`     | Format source files with Prettier |

## License

UNLICENSED - this is a personal learning project.
