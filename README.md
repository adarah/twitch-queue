# Channel Points Queue
A Twitch panel extension that implements a queue managed by channel point rewards.

The queue state is persisted in a [PlanetScale](https://planetscale.com/) instance.

## Developing
### Required tools:
- [Caddy](https://caddyserver.com/v2)
- [Twitch Developer Rig](https://dev.twitch.tv/docs/extensions/rig/)
- [Nodejs](https://nodejs.org/en/)

### Start dev server
```bash
npm run dev
```

### Deployment
```bash
npm run build

// Then upload the generated files (in /out) on Twitch and wait for the approval proccess
```